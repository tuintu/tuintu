import { result } from '../src/core.js';
import { err, ok } from '../src/core/result.js';

const res = err("Hello!");

const msg = result.expect(res, "Expected Ok value");

console.log(msg);
