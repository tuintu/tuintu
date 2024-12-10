import { panic } from '../core.js';

export enum ResultType {
    Ok = 'ok',
    Err = 'err',
}

export type Result<T, E> =
    | { type: ResultType.Ok, ok: T }
    | { type: ResultType.Err, err: E }

export namespace Result {
    export function all<const A extends Result<any, any>[]>(
        results: A,
    ): Result<
        { [I in keyof A]: A[I] extends Result<infer T, any> ? T : unknown },
        A extends Result<any, infer E>[] ? E : unknown
    > {
        const oks = [];
        for (const result of results) {
            switch (result.type) {
                case ResultType.Ok: {
                    oks.push(result.ok);
                    break;
                }
                case ResultType.Err: return result;
            }
        }

        return { type: ResultType.Ok, ok: oks as any };
    }

    export function map<T, E, R>(self: Result<T, E>, mapper: (ok: T) => R): Result<R, E> {
        switch (self.type) {
            case ResultType.Ok: return { type: ResultType.Ok, ok: mapper(self.ok) };
            case ResultType.Err: return self;
        }
    }

    export function mapErr<T, E, R>(self: Result<T, E>, mapper: (err: E) => R): Result<T, R> {
        switch (self.type) {
            case ResultType.Ok: return self;
            case ResultType.Err: return { type: ResultType.Err, err: mapper(self.err) };
        }
    }

    export function expect<T, E>(self: Result<T, E>, message: string): T {
        switch (self.type) {
            case ResultType.Ok: return self.ok;
            case ResultType.Err: panic.violated(`expected ok: ${message}`);
        }
    }
}
