import { panic } from "../core.js";
import { Variant } from "./variant.js";

export type Result<T, E> = Variant<["ok", T] | ["err", E]>;

export function ok<const T>(ok: T): Result<T, never> {
    return { type: "ok", ok };
}

export function err<const T>(err: T): Result<never, T> {
    return { type: "err", err };
}

export function all<const A extends Result<any, any>[]>(
    results: A,
): Result<
    { [I in keyof A]: A[I] extends Result<infer T, any> ? T : unknown },
    A extends Result<any, infer E>[] ? E : unknown
> {
    const oks = [];
    for (const result of results) {
        switch (result.type) {
            case "ok": {
                oks.push(result.ok);
                break;
            }
            case "err":
                return result;
        }
    }

    return ok(oks as any);
}

export function map<T, E, R>(
    self: Result<T, E>,
    mapper: (ok: T) => R,
): Result<R, E> {
    switch (self.type) {
        case "ok":
            return ok(mapper(self.ok));
        case "err":
            return self;
    }
}

export function mapErr<T, E, R>(
    self: Result<T, E>,
    mapper: (err: E) => R,
): Result<T, R> {
    switch (self.type) {
        case "ok":
            return self;
        case "err":
            return err(mapper(self.err));
    }
}

export function expect<T, E>(self: Result<T, E>, message: string): T {
    switch (self.type) {
        case "ok":
            return self.ok;
        case "err": {
            const errString = (() => {
                const e = self.err;
                if (e instanceof Error) {
                    return `${e.stack ?? e.message}`;
                }

                return `Error value: ${String(e)}`;
            })();
            panic.violated(`expected ok: ${message}\n${errString}\nPanic:`);
        }
    }
}

export function unwrapOr<T, E, F>(
    self: Result<T, E>,
    fallback: F,
): T | (E extends never ? never : F) {
    switch (self.type) {
        case "ok":
            return self.ok;
        case "err":
            return fallback as any;
    }
}

export function unwrapOrElse<T, E, F>(
    self: Result<T, E>,
    fallback: () => F,
): T | (E extends never ? never : F) {
    switch (self.type) {
        case "ok":
            return self.ok;
        case "err":
            return fallback() as any;
    }
}

export function flatten<T, E, F>(
    result: Result<Result<T, E>, F>,
): Result<T, E | F> {
    switch (result.type) {
        case "ok":
            return result.ok;
        case "err":
            return result;
    }
}
