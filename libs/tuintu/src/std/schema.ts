import type { StandardSchemaV1 } from "@standard-schema/spec";
import { err, ok, Result } from "../core/result.js";

type ValidateMethod<Input, Output> = StandardSchemaV1<
    Input,
    Output
>["~standard"]["validate"];

type Arguments<F> = F extends (...args: infer Args) => any ? Args : never;

type SyncStandardSchemaV1<Input = unknown, Output = unknown> = Omit<
    StandardSchemaV1<Input, Output>,
    "~standard"
> & {
    "~standard": Omit<
        StandardSchemaV1<Input, Output>["~standard"],
        "validate"
    > & {
        validate: (
            ...args: Arguments<ValidateMethod<Input, Output>>
        ) => Awaited<ReturnType<ValidateMethod<Input, Output>>>;
    };
};

/**
 * @experimental
 */
export function parseSync<const S extends SyncStandardSchemaV1>(
    schema: S,
    data: unknown,
): Result<StandardSchemaV1.InferOutput<S>, readonly StandardSchemaV1.Issue[]> {
    const res = schema["~standard"].validate(data);
    if (res.issues) {
        return err(res.issues);
    }

    return ok(res.value);
}

export async function parseAsync<const S extends StandardSchemaV1>(
    schema: S,
    data: unknown,
): Promise<
    Result<StandardSchemaV1.InferOutput<S>, readonly StandardSchemaV1.Issue[]>
> {
    const res = await schema["~standard"].validate(data);
    if (res.issues) {
        return err(res.issues);
    }

    return ok(res.value);
}
