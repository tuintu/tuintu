import { err, ok, Result } from './result.js';

export function sync<R>(runner: () => R): Result<R, unknown> {
    try {
        return ok(runner());
    } catch (e) {
        return err(e);
    }
}

export async function promise<R>(promise: Promise<R>): Promise<Result<Awaited<R>, unknown>> {
    try {
        return ok(await promise);
    } catch (e) {
        return err(e);
    }
}

export async function async<R>(runner: () => Promise<R>): Promise<Result<Awaited<R>, unknown>> {
    try {
        return ok(await runner());
    } catch (e) {
        return err(e);
    }
}
