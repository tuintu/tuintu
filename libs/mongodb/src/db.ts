import { Document, Db as UnsafeDb } from "mongodb";
import { unsafe } from "tuintu/core";
import { MongoCollection } from "./collection.js";
import { ok, Result } from "tuintu/core/result";
import { StandardSchemaV1 } from "@standard-schema/spec";

export class MongoDb {
    private db: UnsafeDb;

    private constructor(db: UnsafeDb) {
        this.db = db;
    }

    public static new(db: UnsafeDb): MongoDb {
        return new MongoDb(db);
    }

    public collection<T extends Document>(
        ctx: CollectionCtx<T>,
    ): Result<MongoCollection<T>, unknown> {
        const { name, schema } = ctx;

        const collectionRes = unsafe.sync(() => this.db.collection(name));
        if (collectionRes.type === "err") {
            return collectionRes;
        }

        const collection = MongoCollection.new({
            collection: collectionRes.ok,
            schema,
        });
        return ok(collection);
    }
}

export type CollectionCtx<T extends Document> = {
    name: string;
    schema: StandardSchemaV1<unknown, T>;
};
