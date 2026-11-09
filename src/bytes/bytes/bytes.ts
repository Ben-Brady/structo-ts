import type { Serializer } from "../../types.ts";

/**
 * `st.bytes(st.u32())`, a dynamic amount of bytes prefixed with it's length
 *
 * This is very similar to a string, except the contents are not decoded
 *
 * ---
 *
 * ```ts
 * const File = st.object({
 *     name: st.string(st.u32()),
 *     contents: st.bytes(st.u32()),
 * })
 * ```
 *
 * @group String / Bytes
 */
export function bytes(length: Serializer<number>): Serializer<Uint8Array> {
    return {
        write: (ctx, value) => {
            length.write(ctx, value.byteLength);

            ctx.reserve(value.byteLength);
            ctx.bytes.set(value, ctx.offset);
            ctx.offset += value.byteLength;
        },
        read: (ctx) => {
            const size = length.read(ctx);

            const slice = ctx.bytes.slice(ctx.offset, ctx.offset + size);
            ctx.offset += size;
            return slice;
        },
    };
}
