import { Result, ResultType } from './result.js';

export function sync<R>(runner: () => R): Result<R, unknown> {
    try {
        const ok = runner();
        return { type: ResultType.Ok, ok };
    } catch (err) {
        return { type: ResultType.Err, err }
    }
}

export async function promise<R>(promise: Promise<R>): Promise<Result<Awaited<R>, unknown>> {
    try {
        const ok = await promise;
        return { type: ResultType.Ok, ok: ok as any };
    } catch (err) {
        return { type: ResultType.Err, err };
    }
}

export async function async<R>(runner: () => Promise<R>): Promise<Result<Awaited<R>, unknown>> {
    try {
        const ok = await runner();
        return { type: ResultType.Ok, ok: ok as any };
    } catch (err) {
        return { type: ResultType.Err, err };
    }
}
