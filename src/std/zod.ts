import { z } from 'zod';
import { Result } from '../core/result';
import { Tag } from '../core/tag';

export function parse<const S extends z.Schema>(
    schema: S,
    data: unknown,
): Result<z.output<S>, z.ZodError> {
    const res = schema.safeParse(data);
    switch (res.success) {
        case true: return Tag('ok', res.data);
        case false: return Tag('err', res.error);
    }
}
