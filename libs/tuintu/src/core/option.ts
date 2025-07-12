import { Variant } from "./variant.js";

export type Option<T> = Variant<["some", T] | ["none"]>;

export function some<const T>(some: T): Option<T> {
    return { type: "some", some };
}

export function none(): Option<never> {
    return { type: "none" };
}
