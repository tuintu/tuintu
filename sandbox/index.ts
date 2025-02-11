import { result } from '../src/core.js';
import { err, ok, Result } from '../src/core/result.js';

const res = err("Hello!");

const msg = result.unwrapOrElse(res, () => 128);

console.log(msg);
