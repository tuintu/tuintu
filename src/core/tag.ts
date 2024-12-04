export type Tagged<Entries> =
    Entries extends [infer Tag extends string, infer Type]
        ? { [Tag.symbol]: Tag } & { [K in Tag]: Type }
        : Entries extends [infer Tag]
            ? { [Tag.symbol]: Tag }
            : unknown;
;

export function Tag<R, const T extends string, const V>(
    tag: T,
    value: unknown extends R ? V : (Variant<Unpromise<Variant<R, T>>, T>)[T & keyof Variant<Unpromise<Variant<R, T>>, T>],
): unknown extends R ? Tagged<[T, V]> : Variant<R, T>;
export function Tag<const TaggedConst extends Tagged<[Tag, any]>, const Tag>(tag: Tag): { [Tag.symbol]: Tag };
export function Tag<const T extends string, V>(tag: T, value?: V): Tagged<[T, V]> {
    if (arguments.length === 1) {
        return { [Tag.symbol]: tag } as any;
    } else {
        return { [Tag.symbol]: tag, [tag]: value } as any;
    }
}

type Variant<Tagged, Tag> = Tagged & { [Tag.symbol]: Tag };
type Unpromise<T> = T extends PromiseLike<any> ? never : T;

export namespace Tag {
    export const symbol: unique symbol = Symbol('tag');

    export function is<T extends Tagged<[string, any]>, const Tag extends T[typeof Tag.symbol]>(tagged: T, tag: Tag): tagged is T & { [Tag.symbol]: Tag }  {
        return tagged[Tag.symbol] === tag;
    }
}
