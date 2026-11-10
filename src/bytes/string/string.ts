import type { Serializer } from "../../types.ts";

/**
 * `st.string` stores string data by writing/reading the length and then reading that many bytes
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
 * @group String / Bytes
 * @document ./string.md
 */
export function string(length: Serializer<number>): Serializer<string> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder("utf-8", { fatal: true });

    return {
        write(ctx, value) {
            if (typeof value !== "string") throw new Error("Expected String");
            const size = value.length;

            ctx.reserve((length.size ?? 0) + size);
            length.write(ctx, size);

            const target = new Uint8Array(ctx.buffer, ctx.offset, size);
            encoder.encodeInto(value, target);
            ctx.offset += size;
        },
        read(ctx) {
            const size = length.read(ctx);

            const target = new Uint8Array(ctx.buffer, ctx.offset, size);
            const output = decoder.decode(target);
            ctx.offset += size;
            return output;
        },
    };
}
