export type Variant<
    Variants extends [PropertyKey, any] | [PropertyKey],
    Key extends PropertyKey = "type",
> = Prettify<
    Variants extends [infer Name extends PropertyKey, infer Payload]
        ? { [K in Key]: Name } & { [K in Name]: Payload }
        : Variants extends [infer Name extends PropertyKey]
        ? { [K in Key]: Name }
        : never
>;

type Prettify<T> = { [K in keyof T]: T[K] } & {};
