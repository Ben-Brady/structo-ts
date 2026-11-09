import type { Serializer } from "../../types.ts";

/**
 * `st.string stores string data by writing/reading the length and then reading that many bytes
 *
 *  used to store it's length
 *
 * Note: The length stored is the byte length, not string length
 *
 * ---
 * ```ts
 * const User = st.object({
 *     username: st.string(st.u32())
 * })
 * ```
 *
 *
 * @group String/Bytes
 */
export function string(length: Serializer<number>): Serializer<string> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const lengthSize = length.size ?? 0;
    return {
        write: (ctx, value) => {
            if (typeof value !== "string") throw new Error("Expected String");
            const bytes = encoder.encode(value);

            const size = bytes.byteLength;
            ctx.reserve(size + lengthSize);

            length.write(ctx, size);
            ctx.bytes.set(bytes, ctx.offset);
            ctx.offset += size;
        },
        read: (ctx) => {
            const size = length.read(ctx);
            const section = ctx.buffer.slice(ctx.offset, ctx.offset + size);
            ctx.offset += size;
            return decoder.decode(section);
        },
    };
}
