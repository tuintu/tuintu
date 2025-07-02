import { result } from "../src/core.js";
import { none, Option, some } from "../src/core/option.js";
import { err, ok, Result } from "../src/core/result.js";
import { collect, collectors } from "../src/std/collect.js";

const res = ok("Hello!");

const msg = result.unwrapOrElse(res, () => 128);
const msg2 = result.unwrapOr(res, 128);

console.log(msg);
console.log(msg2);

const numsArr = [10, 1, 5, 5, -6, 7, 2, 4, 3, 987, 1, 1, 1, 1, 0];
const numsSet = collect(numsArr)(() => collectors.set());
console.log(numsSet);
const numsArr2 = collect(numsSet)(() => collectors.array());
console.log(numsArr2);

const tuples: [string, number][] = [
    ["foo", 10],
    ["bar", 20],
    ["baz", 30],
    ["foo", 50],
] as const;

const map = collect(tuples)(() => collectors.map());
// const map2 = collectSeparate(tuples, () => collectors.map());
console.log(map);
// console.log(map2);

const okArr = [ok(10), ok(20), ok(50), ok(100), ok(33), ok(-500), ok(7)];
const okArrRes = collect(okArr)(() => collectors.result(collectors.array));
console.log(okArrRes);

const errArr = [ok(10), ok(20), ok(50), err(100), ok(33), ok(-500), ok(7)];
const errArrRes = collect(errArr)(() => collectors.result(collectors.array));
console.log(errArrRes);

const okArrResGeneric = collect(okArr)(() => collectors.result(collectors.set));
console.log(okArrResGeneric);

const tupleResults: Result<[string, number], string>[] = [
    ok(["foo", 10]),
    ok(["bar", 20]),
    ok(["baz", 30]),
    ok(["bar", 50]),
];

const errMap = collect(tupleResults)(() => collectors.result(collectors.map));
const errMap2 = collect(tupleResults)(() => collectors.result(collectors.map));
console.log(errMap);
console.log(errMap2);

let maybeNumber: Option<number> = none();
console.log(maybeNumber);
maybeNumber = some(10);
console.log(maybeNumber);
