import { result, unsafe } from '../core.js';
import { Result } from '../core/result.js';
import { blob } from '../std.js';

export async function text(self: Blob): Promise<Result<string, unknown>> {
    return unsafe.promise(self.text());
}

export async function arrayBuffer(self: Blob): Promise<Result<ArrayBuffer, unknown>> {
    return unsafe.promise(self.arrayBuffer())
}

export async function bytes(self: Blob): Promise<Result<Uint8Array, unknown>> {
    const arrayBufferRes = await blob.arrayBuffer(self);
    return result.map(arrayBufferRes, ab => new Uint8Array(ab));
}
