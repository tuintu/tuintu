import { unsafe } from '../core';
import { Result } from '../core/result';

export function arrayBuffer(self: File): Promise<Result<ArrayBuffer, unknown>> {
    return unsafe.promise(self.arrayBuffer());
}
