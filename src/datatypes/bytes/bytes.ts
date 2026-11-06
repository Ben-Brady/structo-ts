import * as st from "../../index.ts";

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
            ctx.bytes.set(value, ctx.offset);
            ctx.offset += size;
        },
        read: (ctx) => {
            const slice = ctx.bytes.slice(ctx.offset, ctx.offset + size);
            ctx.offset += size;
            return slice;
        },
    };
}
