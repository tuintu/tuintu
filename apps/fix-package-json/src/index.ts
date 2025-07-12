// import fs from "fs/promises";
// import { panic, result, unsafe } from "tuintu/core";
// import { std } from "tuintu/tu";
// import z from "zod";

// async function main(): Promise<void> {
//     console.log(`⌛🛠️  Fixing package.json exports...`);

//     const packageJsonPath = process.argv[2];
//     if (packageJsonPath === undefined) {
//         panic.violated("package.json path must be specified");
//     }

//     const packageJsonBuffer = result.expect(
//         await unsafe.async(() => fs.readFile(packageJsonPath)),
//         "package.json file should be read",
//     );

//     const packageJson = packageJsonBuffer.toString("utf-8");

//     const packageObj = result.expect(
//         std.json.parse(packageJson),
//         "package.json should parse to object",
//     );

//     const packageDataZod = z
//         .object({
//             main: z.string(),
//             module: z.string(),
//             types: z.string(),
//             exports: z.record(
//                 z.string(),
//                 z.object({
//                     types: z.string(),
//                     import: z.string(),
//                     require: z.string(),
//                 }),
//             ),
//         })
//         .passthrough();

//     const packageData = result.expect(
//         std.zod.parse(packageDataZod, packageObj),
//         "package.json should be shaped correctly",
//     );

//     packageData.main = ensureSuffix(packageData.main, ".cjs");
//     packageData.module = ensureSuffix(packageData.module, ".js");
//     packageData.types = ensureSuffix(
//         stripSuffix(packageData.types, ".d.cts"),
//         ".d.ts",
//     );

//     for (const exportPath of Object.keys(packageData.exports)) {
//         const resolvers = packageData.exports[exportPath];
//         if (!resolvers) {
//             continue;
//         }

//         resolvers.require = ensureSuffix(resolvers.require, ".cjs");
//         resolvers.import = ensureSuffix(resolvers.import, ".js");
//         resolvers.types = ensureSuffix(
//             stripSuffix(resolvers.types, ".d.cts"),
//             ".d.ts",
//         );
//     }

//     const orderedPackageJson: Partial<z.output<typeof packageDataZod>> = {
//         ...packageData,
//     };

//     // reorder fields
//     shiftKeyToEnd(orderedPackageJson, "main");
//     shiftKeyToEnd(orderedPackageJson, "module");
//     shiftKeyToEnd(orderedPackageJson, "types");
//     shiftKeyToEnd(orderedPackageJson, "exports");

//     const updatedPackageJson = result.expect(
//         unsafe.sync(() => JSON.stringify(orderedPackageJson, undefined, 4)),
//         "Updated package.json should stringify to JSON",
//     );

//     result.expect(
//         await unsafe.async(() =>
//             fs.writeFile(packageJsonPath, updatedPackageJson),
//         ),
//         "Updated package.json should be written",
//     );

//     console.log(`✅🛠️  Fixed package.json!`);
// }

// function ensureSuffix(str: string, suffix: string): string {
//     if (str.endsWith(suffix)) {
//         return str;
//     }

//     return `${str}${suffix}`;
// }

// function stripSuffix(str: string, suffix: string): string {
//     if (!str.endsWith(suffix)) {
//         return str;
//     }

//     return str.substring(0, str.length - suffix.length);
// }

// function shiftKeyToEnd<O extends object>(obj: O, key: keyof O): void {
//     const value = obj[key];
//     delete obj[key];
//     obj[key] = value;
// }

// main();
