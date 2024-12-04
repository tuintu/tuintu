import { unsafe } from '../core';
import { Result } from '../core/result';

export type JsonResult = Result<unknown, unknown>;
export type BlobResult = Result<Blob, unknown>;

export function json(body: Body): Promise<JsonResult> {
    return unsafe.promise(body.json());
}

export function blob(body: Body): Promise<BlobResult> {
    return unsafe.promise(body.blob());
}
