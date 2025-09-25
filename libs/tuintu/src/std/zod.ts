import { z } from "zod";
import { err, ok, Result } from "../core/result.js";

/**
 * @deprecated Use the `schema` module from std instead
 */
export function parse<const S extends z.Schema>(
    schema: S,
    data: unknown,
): Result<z.output<S>, z.ZodError> {
    const res = schema.safeParse(data);
    switch (res.success) {
        case true:
            return ok(res.data);
        case false:
            return err(res.error);
    }
}
