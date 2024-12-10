import { unsafe } from '../core.js';
import { Result } from '../core/result.js';

export function fetch(
    input: RequestInfo | URL,
    init?: RequestInit,
): Promise<Result<Response, unknown>> {
    return unsafe.promise(globalThis.fetch(input, init));
}
