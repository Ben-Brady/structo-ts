import type { Serializer, WriterContext } from "../../types.ts";
import { throwSerializationError } from "../utils.ts";

const scratch = new ArrayBuffer(4096, { maxByteLength: 1024 * 1024 * 512 });
const scratchBytes = new Uint8Array(scratch);
const scratchView = new DataView(scratch);

/**
 * The options used for `write`
 *
 * @group Functions
 */
export interface WriteOptions {
    /**
     * The amount of space to allocate in advance
     *
     * This is overriden if the full size is statically known
     */
    initialSize?: number;

    /**
     * Disable error reporting
     *
     * This can be useful to gain a small amount of performance
     */
    disableErrorReporting?: boolean;
}

/**
 * Writes a schema into a newly allocated `ArrayBuffer`.
 *
 * ---
 *
 * ```ts
 * const User = st.object({
 *     name: st.string(st.u8()),
 *     age: st.u32(),
 * })
 *
 * const data = st.write(User, {
 *     name: "nnilky",
 *     age: 26,
 * })
 * ```
 *
 * @throws {Error} If serialization fails, throws an error with a path to what caused the error
 *
 * @group Functions
 */
export function write<T>(
    serializer: Serializer<T>,
    value: NoInfer<T>,
    options?: WriteOptions,
): ArrayBuffer {
    let initialSize = options?.initialSize ?? serializer.size ?? serializer.estimateSize?.(value);
    if (Number.isNaN(initialSize)) {
        console.error("Got NaN from initialSize/serializer.size/serializer.estimateSize");
        initialSize = 0;
    }

    const path: (string | number)[] = [];
    let byteLength = initialSize || 4096;
    const oldSize = scratch.byteLength;
    scratch.resize(byteLength);
    new Uint8Array(scratch, 0, Math.min(oldSize, byteLength)).fill(0);

    const ctx: WriterContext<ArrayBuffer> = {
        offset: 0,
        buffer: scratch,
        bytes: scratchBytes,
        view: scratchView,

        pushPath: options?.disableErrorReporting
            ? () => {} //
            : (key) => path.push(key),
        popPath: options?.disableErrorReporting
            ? () => {} //
            : () => path.pop(),

        reserve: (length: number) => {
            if (length <= 0) return;
            while (ctx.offset + length > byteLength) {
                byteLength = Math.ceil(byteLength * 2);
                scratch.resize(byteLength);
            }
        },
    };

    try {
        serializer.write(ctx, value);
    } catch (err) {
        throwSerializationError(err, path);
    }

    return ctx.bytes.slice(0, ctx.offset).buffer;
}
