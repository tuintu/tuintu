import { result } from "../core.js";
import { Result } from "../core/result.js";

export class Anyhow {
    private _nominal = undefined;
    public cause: unknown;
    public context: string;

    private constructor(cause: unknown, context: string) {
        this.cause = cause;
        this.context = context;
    }

    public toString(): string {
        return `Context: ${this.context}\n${String(this.cause)}`;
    }

    public static contextualize<T, E>(
        res: Result<T, E>,
        context: string,
    ): Result<T, Anyhow> {
        return result.mapErr(res, (e) => new Anyhow(e, context));
    }
}
