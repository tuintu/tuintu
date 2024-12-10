import { unsafe } from '../core.js';
import { Result } from '../core/result.js';

export type JsonResult = Result<unknown, unknown>;
export type BlobResult = Result<Blob, unknown>;

export function json(body: Body): Promise<JsonResult> {
    return unsafe.promise(body.json());
}

export function blob(body: Body): Promise<BlobResult> {
    return unsafe.promise(body.blob());
}
