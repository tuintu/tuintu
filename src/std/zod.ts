import { z } from 'zod';
import { Result, ResultType } from '../core/result.js';

export function parse<const S extends z.Schema>(
    schema: S,
    data: unknown,
): Result<z.output<S>, z.ZodError> {
    const res = schema.safeParse(data);
    switch (res.success) {
        case true: return { type: ResultType.Ok, ok: res.data };
        case false: return { type: ResultType.Err, err: res.error };
    }
}
