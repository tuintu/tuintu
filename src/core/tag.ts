export type Tagged<Entries> =
    Entries extends [infer Tag extends string, infer Type]
        ? { [Tag.symbol]: Tag } & { [K in Tag]: Type }
        : Entries extends [infer Tag]
            ? { [Tag.symbol]: Tag }
            : unknown;
;

export type ExtractTagged<T> = Extract<T, { [Tag.symbol]: string }>;
export type UnionKeys<T> = T extends T ? keyof T : never;
export type VariantKey<Enum> = ExtractTagged<Enum>[typeof Tag.symbol];
export type Variant<Enum, Key extends VariantKey<Enum>> = Extract<ExtractTagged<Enum>, { [Tag.symbol]: Key }>;
export type VariantValue<Enum, Key extends VariantKey<Enum>> = Key extends keyof Variant<Enum, Key> ? Variant<Enum, Key>[Key] : never;

export type PayloadVariantKey<Enum> = ExtractPayloadVariantKey<Enum, VariantKey<Enum>>;
export type ExtractPayloadVariantKey<Enum, Key extends VariantKey<Enum>> = Key extends keyof Variant<Enum, Key> ? Key : never;
export type UnitVariantKey<Enum> = Exclude<VariantKey<Enum>, PayloadVariantKey<Enum>>;

export function Tag<const Key extends string, const Value, Enum = any>(
    key: Key & VariantKey<Enum>, // need this to be all variants for autocomplete (otherwise unit keys are excluded)
    value: VariantValue<Enum, typeof key & PayloadVariantKey<Enum>>,
): Variant<Enum, typeof key>;

export function Tag<const Key extends string, Enum = any>(
    key: Key & UnitVariantKey<Enum>,
): Variant<Enum, typeof key>;

export function Tag<const T extends string, V>(tag: T, value?: V): Tagged<[T, V]> {
    if (arguments.length === 1) {
        return { [Tag.symbol]: tag } as any;
    } else {
        return { [Tag.symbol]: tag, [tag]: value } as any;
    }
}

export namespace Tag {
    export const symbol: unique symbol = Symbol('tag');

    export function is<T extends Tagged<[string, any]>, const Tag extends T[typeof Tag.symbol]>(tagged: T, tag: Tag): tagged is T & { [Tag.symbol]: Tag }  {
        return tagged[Tag.symbol] === tag;
    }
}
