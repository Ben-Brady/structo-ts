import type { Serializer } from "../../types.js";

/**
 * `st.json` stores string data by writing/reading the length and then reading that many bytes
 *
 * The type passed in is the type used to store it's length
 *
 * Note: The length stored is the byte length, not string length
 *
 * ```
 * st.string(st.u32())
 * ```
 *
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
