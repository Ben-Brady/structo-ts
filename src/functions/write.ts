import type { Serializer, WriterContext } from "../types.ts";
import { throwSerializationError } from "./utils.ts";

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
     * The amount the allocation grows when it runs out of space, this is a multiple of the current size
     *
     * By default this is 2, so doubles the size each time
     */
    growthFactor?: number;

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
export function write<T>(serializer: Serializer<T>, value: T, options?: WriteOptions): ArrayBuffer {
    const growthFactor = options?.growthFactor ?? 1.5;

    let initialSize = options?.initialSize ?? serializer.size ?? serializer.estimateSize?.(value);
    let byteLength = initialSize || 4096;
    if (Number.isNaN(initialSize)) {
        console.error("Got NaN from size or estimateSize:");
        console.error(serializer);
        byteLength = 4096;
    }

    const path: (string | number)[] = [];
    const initialBuffer = new ArrayBuffer(byteLength);

    const ctx: WriterContext<ArrayBuffer> = {
        offset: 0,
        buffer: initialBuffer,
        bytes: new Uint8Array(initialBuffer),
        view: new DataView(initialBuffer),

        pushPath: options?.disableErrorReporting
            ? () => {} //
            : (key) => path.push(key),
        popPath: options?.disableErrorReporting
            ? () => {} //
            : () => path.pop(),

        reserve: (length: number) => {
            if (length <= 0) return;
            while (ctx.offset + length > byteLength) {
                // let old = byteLength;
                byteLength = Math.ceil(byteLength * growthFactor);
                // console.log(`Resizing ${old} ->  ${byteLength}`);

                ctx.buffer = ctx.buffer.transfer(byteLength);
                ctx.view = new DataView(ctx.buffer);
                ctx.bytes = new Uint8Array(ctx.buffer);
            }
        },
    };

    try {
        serializer.write(ctx, value);
    } catch (err) {
        throwSerializationError(err, path);
    }

    // console.log(`initial=${initialSize} actual=${ctx.offset}`);
    if (ctx.buffer.byteLength === ctx.offset) {
        return ctx.buffer;
    } else {
        return ctx.buffer.transfer(ctx.offset);
    }
}
