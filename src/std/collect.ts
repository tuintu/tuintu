import { ControlFlow } from "../core/control-flow.js";
import { err, ok, Result } from "../core/result.js";

export interface Collector<T, Acc, Break, Collection> {
    initializer: () => Acc;
    accumulator: (acc: Acc, element: T) => ControlFlow<Break, void>;
    finalizer: (flow: ControlFlow<Break, Acc>) => Collection;
}

export function collect<const T>(
    iter: Iterable<T>,
): <Acc, Break, Collection>(
    createCollector: () => Collector<T, Acc, Break, Collection>,
) => Collection {
    const collect = <Acc, Break, Collection>(
        createCollector: () => Collector<T, Acc, Break, Collection>,
    ) => {
        const collector = createCollector();
        const acc = collector.initializer();
        for (const element of iter) {
            const flow = collector.accumulator(acc, element);
            switch (flow.type) {
                case "break": {
                    return collector.finalizer(flow);
                }
                case "continue": {
                    continue;
                }
            }
        }

        return collector.finalizer({ type: "continue", continue: acc });
    };

    return collect;
}

export const collectors = {
    array<const T>(): Collector<T, T[], never, T[]> {
        return {
            initializer() {
                return [];
            },
            accumulator(arr, x) {
                arr.push(x);
                return { type: "continue", continue: undefined };
            },
            finalizer(flow) {
                switch (flow.type) {
                    case "break":
                        return flow.break;
                    case "continue":
                        return flow.continue;
                }
            },
        };
    },
    set<const T>(): Collector<T, Set<T>, never, Set<T>> {
        return {
            initializer() {
                return new Set();
            },
            accumulator(set, x) {
                set.add(x);
                return { type: "continue", continue: undefined };
            },
            finalizer(flow) {
                switch (flow.type) {
                    case "break":
                        return flow.break;
                    case "continue":
                        return flow.continue;
                }
            },
        };
    },
    map<const K, const V>(): Collector<
        readonly [K, V],
        Map<K, V>,
        never,
        Map<K, V>
    > {
        return {
            initializer() {
                return new Map();
            },
            accumulator(map, [k, v]) {
                map.set(k, v);
                return { type: "continue", continue: undefined };
            },
            finalizer(flow) {
                switch (flow.type) {
                    case "break":
                        return flow.break;
                    case "continue":
                        return flow.continue;
                }
            },
        };
    },
    resultArray<const T, const E>(): Collector<
        Result<T, E>,
        T[],
        E,
        Result<T[], E>
    > {
        return {
            initializer() {
                return [];
            },
            accumulator(acc, element) {
                switch (element.type) {
                    case "err":
                        return { type: "break", break: element.err };
                    case "ok": {
                        acc.push(element.ok);
                        return { type: "continue", continue: undefined };
                    }
                }
            },
            finalizer(flow) {
                switch (flow.type) {
                    case "break":
                        return err(flow.break);
                    case "continue":
                        return ok(flow.continue);
                }
            },
        };
    },
    result<const T, const E, const OkCollection>(
        okCollector: () => Collector<T, OkCollection, never, OkCollection>,
    ): Collector<Result<T, E>, OkCollection, E, Result<OkCollection, E>> {
        const okCollectorObj = okCollector();
        return {
            initializer() {
                return okCollectorObj.initializer();
            },
            accumulator(acc, element) {
                switch (element.type) {
                    case "err":
                        return { type: "break", break: element.err };
                    case "ok": {
                        okCollectorObj.accumulator(acc, element.ok);
                        return { type: "continue", continue: undefined };
                    }
                }
            },
            finalizer(flow) {
                switch (flow.type) {
                    case "break":
                        return err(flow.break);
                    case "continue":
                        return ok(flow.continue);
                }
            },
        };
    },
} as const;
