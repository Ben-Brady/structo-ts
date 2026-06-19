import type { Serializer } from "../../types.js";

/**
 * Fixed length bytes
 *
 * ```
 * st.bytes(4)
 * ```
 */
export function bytes(size: number): Serializer<ArrayBuffer> {
    return {
        size,
        write: (ctx, value) => {
            const bytes = new Uint8Array(value);
            if (bytes.length !== size) throw new Error("Invalid Length");

            ctx.alloc(size);
            new Uint8Array(ctx.buffer).set(bytes, ctx.offset);
            ctx.offset += size;
        },
        read: (ctx) => {
            const slice = ctx.buffer.slice(ctx.offset, ctx.offset + size);
            ctx.offset += size;
            return slice;
        },
    };
}
