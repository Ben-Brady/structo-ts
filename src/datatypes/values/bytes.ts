import * as st from "../../index.js";
/**
 * Fixed length bytes
 *
 * ```
 * st.bytes(4)
 * ```
 */
export function bytes(size: number): st.Serializer<Uint8Array> {
    return {
        size,
        write: (ctx, value) => {
            if (value.length !== size) throw new Error("Invalid Length");

            ctx.reserve(size);
            ctx.bytes.set(value, ctx.offset)
            ctx.offset += size;
        },
        read: (ctx) => {
            const arr = ctx.bytes.subarray(ctx.offset, ctx.offset + size);
            ctx.offset += size;
            return arr.slice();
        },
    };
}
