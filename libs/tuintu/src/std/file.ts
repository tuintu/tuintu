import { unsafe } from "../core.js";
import { Result } from "../core/result.js";

export function arrayBuffer(self: File): Promise<Result<ArrayBuffer, unknown>> {
    return unsafe.async(() => self.arrayBuffer());
}
