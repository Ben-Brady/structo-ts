import { st } from "../../index.ts";

/**
 * `st.fastString` works similarly to `st.string`, but uses the `encodeInto` api requireing a
 * fixed size length.
 *
 * Note: The length stored is the byte length, not string length
 *
 * ---
 * ```ts
 * const User = st.fastObject({
 *     username: st.fastString(st.u32())
 * })
 * ```
 *
 * @group String / Bytes
 */
export function fastString(length: st.Serializer<number>): st.Serializer<string> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    if (length.size === undefined) throw new Error("Must have a fixed length size");

    return {
        estimateSize: (value) => value.length * 2 + (length.size ?? 0),
        write: (ctx, value) => {
            if (typeof value !== "string") throw new Error("Expected String");

            ctx.reserve(length.size! + (value.length << 1));
            let target = new Uint8Array(ctx.buffer, ctx.offset + length.size!, value.length << 1);
            const written = encoder.encodeInto(value, target).written;

            length.write(ctx, written);
            ctx.offset += written;
        },
        read: (ctx) => {
            const size = length.read(ctx);
            let target = new Uint8Array(ctx.buffer, ctx.offset, size);
            ctx.offset += size;
            return decoder.decode(target);
        },
    };
}
