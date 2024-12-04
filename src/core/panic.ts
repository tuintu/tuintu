/**
 * A panic caused by violating an invariant or expectation of the interface
 */
export function violated(message?: string): never {
    if (message === undefined) {
        throw new Error("violated");
    }
    throw new Error(`violated: ${message}`);
}

/**
 * A panic caused by reaching code which has no guarentee of ever being implemented
 */
export function unimplemented(message?: string): never {
    if (message === undefined) {
        throw new Error("unimplemented");
    }
    throw new Error(`unimplemented: ${message}`);
}

/**
 * A panic caused by reaching code that should never be executed
 */
export function unreachable(message?: string): never {
    if (message === undefined) {
        throw new Error("unreachable");
    }
    throw new Error(`unreachable: ${message}`);
}

/**
 * A panic caused by reaching code which is not yet implemented
 */
export function todo(message?: string): never {
    if (message === undefined) {
        throw new Error("todo");
    }
    throw new Error(`todo: ${message}`);
}
