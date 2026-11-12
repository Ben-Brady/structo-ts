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
 * @group Functions
 */
export function write<TIn, TOut>(
    serializer: Serializer<TIn, TOut>,
    value: TIn,
    options?: WriteOptions,
): ArrayBuffer {
    const initialSize = options?.initialSize ?? 4096;
    const growthFactor = options?.growthFactor ?? 2;

    const path: (string | number)[] = [];
    const initialBuffer = new ArrayBuffer(serializer.size ?? initialSize);

    const ctx: WriterContext<ArrayBuffer> = {
        buffer: initialBuffer,
        bytes: new Uint8Array(initialBuffer),
        view: new DataView(initialBuffer),
        offset: 0,

        pushPath: options?.disableErrorReporting
            ? (Function.prototype as () => void) //
            : (key) => path.push(key),
        popPath: options?.disableErrorReporting
            ? (Function.prototype as () => void) //
            : () => path.pop(),

        reserve: (length: number) => {
            if (length <= 0) return;
            while (ctx.offset + length > ctx.buffer.byteLength) {
                ctx.buffer = ctx.buffer.transferToFixedLength(
                    Math.max(ctx.buffer.byteLength, initialSize) * growthFactor,
                );
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

    if (ctx.buffer.byteLength !== ctx.offset) {
        ctx.buffer = ctx.buffer.transferToFixedLength(ctx.offset);
    }

    return ctx.buffer;
}
