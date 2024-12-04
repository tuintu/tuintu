import { unsafe } from '../core';
import { Result } from '../core/result';

export function fetch(
    input: RequestInfo | URL,
    init?: RequestInit,
): Promise<Result<Response, unknown>> {
    return unsafe.promise(globalThis.fetch(input, init));
}
