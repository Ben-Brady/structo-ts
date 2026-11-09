import * as st from "../../index.ts";

/**
 * `st.fixedBytes(16)`, a fixed amount of bytes
 *
 * ---
 *
 * ```ts
 * const FileHeader = st.object({
 *     magicBytes: st.fixedBytes(8),
 *     // ...
 * })
 * ```
 *
 * @group String / Bytes
 */
export function fixedBytes(size: number): st.Serializer<Uint8Array> {
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
