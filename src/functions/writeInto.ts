import type { WriterContext, Serializer } from "../types.ts";
import { throwSerializationError } from "./utils.ts";

/**
 * The options used for `writeInto`
 *
 * @group Functions
 */
export interface WriteIntoOptions {
    /**
     * Disable error reporting
     */
    disabledErrorReporting?: boolean;
}

/**
 * Writes data into an existing `ArrayBuffer`, this is used to edit existing data without a copy.
 *
 * Additionally, it can be used to reduce garbage collection by reusing a buffer.
 *
 * @returns {numbers} The number of bytes written
 *
 * ---
 *
 * ```ts
 * const User = st.object({
 *     name: st.pipe(st.fixedBytes(16), st.toAscii()),
 *     age: st.u32(),
 * })
 *
 * const buffer = new ArrayBuffer(32);
 * let offset = 0;
 * offset += st.writeInto(buffer, offset, User, {
 *     name: "nnilky",
 *     age: 26
 * })
 * offset += st.writeInto(buffer, offset, User, {
 *     name: "nnilky",
 *     age: 26
 * })
 * ```
 */
export function writeInto<TIn, TOut>(
    buffer: ArrayBuffer | SharedArrayBuffer,
    offset: number,
    serializer: Serializer<TIn, TOut>,
    value: TIn,
    options?: WriteIntoOptions,
): number {
    const path: (string | number)[] = [];

    let ctx: WriterContext = {
        offset,
        buffer,
        bytes: new Uint8Array(buffer),
        view: new DataView(buffer),
        pushPath: options?.disabledErrorReporting
            ? (Function.prototype as () => void)
            : (key) => path.push(key),
        popPath: options?.disabledErrorReporting
            ? (Function.prototype as () => void)
            : () => path.pop(),
        reserve(length: number) {
            if (ctx.offset + length > ctx.buffer.byteLength) {
                throw new Error("Attempted to allocate space when writing into an existing buffer");
            }
        },
    };

    try {
        serializer.write(ctx, value);
    } catch (err) {
        throwSerializationError(err, path);
    }

    return ctx.offset - offset;
}
