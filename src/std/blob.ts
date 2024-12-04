import { unsafe } from '../core';
import { Result } from '../core/result';
import { blob } from '../std';

export async function text(self: Blob): Promise<Result<string, unknown>> {
    return unsafe.promise(self.text());
}

export async function arrayBuffer(self: Blob): Promise<Result<ArrayBuffer, unknown>> {
    return unsafe.promise(self.arrayBuffer())
}

export async function bytes(self: Blob): Promise<Result<Uint8Array, unknown>> {
    const arrayBufferRes = await blob.arrayBuffer(self);
    return Result.map(arrayBufferRes, ab => new Uint8Array(ab));
}
