import { Result } from './result';
import { Tag } from './tag';

export function sync<R>(runner: () => R): Result<R, unknown> {
    try {
        const ok = runner();
        return Tag('ok', ok);
    } catch (e) {
        return Tag('err', e);
    }
}

export async function promise<R>(promise: Promise<R>): Promise<Result<Awaited<R>, unknown>> {
    try {
        const ok = await promise;
        return Tag('ok', ok as any);
    } catch (e) {
        return Tag('err', e);
    }
}

export async function async<R>(runner: () => Promise<R>): Promise<Result<Awaited<R>, unknown>> {
    try {
        const ok = await runner();
        return Tag('ok', ok as any);
    } catch (e) {
        return Tag('err', e);
    }
}
