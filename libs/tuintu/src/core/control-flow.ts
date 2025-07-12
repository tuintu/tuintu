import { Variant } from "./variant.js";

export type ControlFlow<B, C> = Variant<["break", B] | ["continue", C]>;
