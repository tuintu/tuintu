import {
    Document,
    Filter as MongoFilter,
    FindOptions,
    Collection as UnsafeCollection,
    InsertOneOptions,
    FindCursor as MongoCursor,
    UpdateOptions,
    UpdateFilter,
    BulkWriteOptions,
    DeleteOptions,
} from "mongodb";
import { unsafe } from "tuintu/core";
import { err, ok, Result } from "tuintu/core/result";
import { std } from "tuintu";
import { z } from "zod";
import { MongoError } from "./error.js";

export class MongoCollection<T extends Document> {
    private collection: UnsafeCollection;
    private zod: z.Schema<T>;

    private constructor(ctx: NewCtx<T>) {
        this.collection = ctx.collection;
        this.zod = ctx.zod;
    }

    public static new<T extends Document>(ctx: NewCtx<T>): MongoCollection<T> {
        return new MongoCollection(ctx);
    }

    public async findOne(
        filter: Filter<T>,
        options?: FindOptions<T>,
    ): Promise<Result<T, MongoError<Unexpected | NotFound>>> {
        // `as any`s are needed because mongodb's typescript support is very bad apparently
        const findRes = await unsafe.async(() =>
            this.collection.findOne(filter as any, options),
        );

        if (findRes.type === "err") {
            return err(
                MongoError.new({
                    type: "unexpected",
                    cause: findRes.err,
                    message:
                        "An unexpected error occurred while searching collection",
                }),
            );
        }

        const doc = findRes.ok;
        if (doc === null) {
            return err(
                MongoError.new({
                    type: "notFound",
                    cause: undefined,
                    message: "Could not find the requested document",
                }),
            );
        }

        const zodRes = std.zod.parse(this.zod, doc);
        if (zodRes.type === "err") {
            return err(
                MongoError.new({
                    type: "unexpected",
                    cause: zodRes.type,
                    message: "The requested document was malformed",
                }),
            );
        }

        const value = zodRes.ok;
        return ok(value);
    }

    public async insertOne(
        doc: T,
        options?: InsertOneOptions,
    ): Promise<Result<void, MongoError<Unexpected>>> {
        const unsafeRes = await unsafe.async(() =>
            this.collection.insertOne(doc, options),
        );

        if (unsafeRes.type === "err") {
            return err(
                MongoError.new({
                    type: "unexpected",
                    cause: unsafeRes.err,
                    message:
                        "An unexpected error occurred while inserting document",
                }),
            );
        }

        const insertRes = unsafeRes.ok;
        if (!insertRes.acknowledged) {
            return err(
                MongoError.new({
                    type: "unexpected",
                    cause: undefined,
                    message: "Collection insertion was not acknowledged",
                }),
            );
        }

        return ok(undefined);
    }

    public find(
        filter: Filter<T>,
        options?: FindOptions,
    ): Result<
        AsyncIterable<Result<T, MongoError<Unexpected>>>,
        MongoError<Unexpected>
    > {
        const unsafeRes = unsafe.sync(() =>
            this.collection.find(filter as any, options),
        );
        if (unsafeRes.type === "err") {
            return err(
                MongoError.new({
                    type: "unexpected",
                    cause: unsafeRes.err,
                    message:
                        "An unexpected error occurred while searching documents",
                }),
            );
        }

        const cursor = unsafeRes.ok;
        return ok(this.createCursor(cursor));
    }

    private async *createCursor(
        cursor: MongoCursor,
    ): AsyncGenerator<Result<T, MongoError<Unexpected>>> {
        for await (const doc of cursor) {
            const zodRes = std.zod.parse(this.zod, doc);
            switch (zodRes.type) {
                case "err": {
                    yield err(
                        MongoError.new({
                            type: "unexpected",
                            cause: zodRes.err,
                            message: "The requested document was malformed",
                        }),
                    );

                    break;
                }
                case "ok": {
                    yield ok(zodRes.ok);
                    break;
                }
            }
        }
    }

    public async updateOne(
        filter: Filter<T>,
        update: Update<T>,
        options?: UpdateOptions,
    ): Promise<Result<void, MongoError<Unexpected | NotFound>>> {
        const unsafeRes = await unsafe.async(() => {
            return this.collection.updateOne(
                filter as any,
                update as any,
                options,
            );
        });

        if (unsafeRes.type === "err") {
            return err(
                MongoError.new({
                    type: "unexpected",
                    cause: unsafeRes.err,
                    message:
                        "An unexpected error occurred while updating collection",
                }),
            );
        }

        const updateRes = unsafeRes.ok;
        if (!updateRes.acknowledged) {
            return err(
                MongoError.new({
                    type: "unexpected",
                    cause: undefined,
                    message: "Collection update was not acknowledged",
                }),
            );
        }

        if (updateRes.modifiedCount < 1) {
            return err(
                MongoError.new({
                    type: "notFound",
                    cause: undefined,
                    message: "Could not find document to update",
                }),
            );
        }

        return ok(undefined);
    }

    public async insertMany(
        docs: T[],
        options?: BulkWriteOptions,
    ): Promise<Result<void, MongoError<Unexpected>>> {
        const unsafeRes = await unsafe.async(() =>
            this.collection.insertMany(docs, options),
        );

        if (unsafeRes.type === "err") {
            return err(
                MongoError.new({
                    type: "unexpected",
                    cause: unsafeRes.err,
                    message:
                        "An unexpected error occurred while inserting into collection",
                }),
            );
        }

        const insertRes = unsafeRes.ok;
        if (!insertRes.acknowledged) {
            return err(
                MongoError.new({
                    type: "unexpected",
                    cause: undefined,
                    message: "Collection insert was not acknowledged",
                }),
            );
        }

        return ok(undefined);
    }

    public async deleteOne(
        filter: Filter<T>,
        options?: DeleteOptions,
    ): Promise<Result<void, MongoError<Unexpected | NotFound>>> {
        const unsafeRes = await unsafe.async(() =>
            this.collection.deleteOne(filter as any, options),
        );

        if (unsafeRes.type === "err") {
            return err(
                MongoError.new({
                    type: "unexpected",
                    cause: unsafeRes.err,
                    message:
                        "An unexpected error occurred while deleting from collection",
                }),
            );
        }

        const deleteRes = unsafeRes.ok;
        if (!deleteRes.acknowledged) {
            return err(
                MongoError.new({
                    type: "unexpected",
                    cause: undefined,
                    message: "Collection delete was not acknowledged",
                }),
            );
        }

        if (deleteRes.deletedCount !== 1) {
            return err(
                MongoError.new({
                    type: "notFound",
                    cause: undefined,
                    message: "Document to delete was not found",
                }),
            );
        }

        return ok(undefined);
    }
}

export type NewCtx<T> = {
    collection: UnsafeCollection;
    zod: z.Schema<T>;
};

export type Filter<T> = MongoFilter<T>;
export type Update<T> = UpdateFilter<T>;

type Unexpected = "unexpected";
type NotFound = "notFound";
