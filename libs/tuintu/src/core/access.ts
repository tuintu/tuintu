export type Accessor<
    Data,
    Methods extends Record<PropertyKey, (...args: any[]) => void>,
> = {
    get: () => Data;
    do: {
        [MethodKey in keyof _DataMethods<Data, Methods>]: (
            ...args: _NonDataArgs<_DataMethods<Data, Methods>[MethodKey]>
        ) => Accessor<ReturnType<Methods[MethodKey]>, Methods>;
    };
    map: <R>(mapper: (data: Data) => R) => Accessor<R, Methods>;
    extend: <MethodsExt>(
        methods: MethodsExt,
    ) => Accessor<Data, _Prettify<_ExtendAWithB<Methods, MethodsExt>>>;
};

type _DataMethods<Data, Methods> = Pick<
    Methods,
    _DataMethodKeys<Methods, Data>
>;

type _DataMethodKeys<Methods, Data> = {
    [MethodKey in keyof Methods]: _IsDataMethod<
        Methods[MethodKey],
        Data
    > extends true
        ? MethodKey
        : never;
}[keyof Methods];

type _IsDataMethod<Method, Data> = Method extends (
    data: Data,
    ...args: any[]
) => void
    ? true
    : false;

type _NonDataArgs<Method> = Method extends (
    data: any,
    ...nonData: infer NonDataArgs
) => void
    ? NonDataArgs
    : never;

type _ExtendAWithB<A, B> = Omit<A, keyof B> & B;

type _Prettify<T> = { [K in keyof T]: T[K] } & {};

export function access<Data>(data: Data): Accessor<Data, {}>;
export function access<
    Data,
    Methods extends Record<PropertyKey, (...args: any[]) => void>,
>(data: Data, methods: Methods): Accessor<Data, Methods>;
export function access<
    Data,
    Methods extends Record<PropertyKey, (...args: any[]) => void>,
>(data: Data, methods: Methods = {} as Methods): Accessor<Data, Methods> {
    const doImpl = {} as any;

    const methodKeys = [
        ...Object.keys(methods),
        ...Object.getOwnPropertySymbols(methods),
    ];

    for (const methodKey of methodKeys) {
        const method = methods[methodKey];
        const dataMethod = (...args: any[]) => {
            const methodReturn = method!(data, ...args);
            return access(methodReturn, methods);
        };

        doImpl[methodKey] = dataMethod;
    }

    return {
        get: () => data,
        do: doImpl as any,
        map: <R>(mapper: (data: Data) => R) => access(mapper(data), methods),
        extend: <MethodsExt>(methodsExt: MethodsExt) =>
            access(data, { ...methods, ...methodsExt }) as any,
    };
}
