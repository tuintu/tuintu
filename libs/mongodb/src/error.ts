export class MongoError<T> {
    private _nominal = undefined;
    public type: T;
    public message: string;
    public cause: unknown;

    private constructor(ctx: NewCtx<T>) {
        const { type, message, cause } = ctx;
        this.type = type;
        this.message = message;
        this.cause = cause;
    }

    public static new<T>(ctx: NewCtx<T>): MongoError<T> {
        return new MongoError(ctx);
    }

    public toString() {
        return `MongoError (${this.type}): ${this.message}\n${String(
            this.cause,
        )}`;
    }
}

export interface NewCtx<T> {
    type: T;
    message: string;
    cause: unknown;
}
