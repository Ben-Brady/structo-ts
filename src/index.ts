export type {
    Infer,
    InferInput,
    InferOutput,
    ReaderContext,
    WriterContext,
    Serializer,
} from "./types.ts";
export { read } from "./read.ts";
export { write, writeInto } from "./write.ts";

export * from "./datatypes/index.ts";
export * from "./transforms/index.ts";
export * from "./utilities/index.ts";

/**
 * This is an alias of the root import to avoid having to do an asterix import
 *
 * ```ts
 * import * as st from "@nnilky/structo"
 * // instead you can do
 * import { st } from "@nnilky/structo"
 * ```
 *
 * @hidden
 */
export * as st from "./import.ts";
