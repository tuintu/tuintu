import { panic } from '../core';
import { Tag, Tagged } from './tag';

export type Result<T, E> = Tagged<
    | ['ok', T]
    | ['err', E]
>

export namespace Result {
    export function all<const A extends Result<any, any>[]>(
        results: A,
    ): Result<
        { [I in keyof A]: A[I] extends Result<infer T, any> ? T : unknown },
        A extends Result<any, infer E>[] ? E : unknown
    > {
        const oks = [];
        for (const result of results) {
            switch (result[Tag.symbol]) {
                case 'ok': {
                    oks.push(result.ok);
                    break;
                }
                case 'err': return result;
            }
        }

        return Tag('ok', oks as any);
    }

    export function map<T, E, R>(self: Result<T, E>, mapper: (ok: T) => R): Result<R, E> {
        switch (self[Tag.symbol]) {
            case 'ok': return Tag('ok', mapper(self.ok));
            case 'err': return self;
        }
    }

    export function mapErr<T, E, R>(self: Result<T, E>, mapper: (err: E) => R): Result<T, R> {
        switch (self[Tag.symbol]) {
            case 'ok': return self;
            case 'err': return Tag('err', mapper(self.err));
        }
    }

    export function expect<T, E>(self: Result<T, E>, message: string): T {
        switch (self[Tag.symbol]) {
            case 'ok': return self.ok;
            case 'err': panic.violated(`expected ok: ${message}`);
        }
    }
}
