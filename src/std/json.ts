import { unsafe } from '../core';
import { Result } from '../core/result';

export function stringify(value: unknown): Result<string, unknown> {
    return unsafe.sync(() => JSON.stringify(value));
}

export function parse(json: string): Result<unknown, unknown> {
    return unsafe.sync(() => JSON.parse(json));
}
