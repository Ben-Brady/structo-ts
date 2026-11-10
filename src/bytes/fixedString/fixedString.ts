import { type Serializer } from "../../import.ts";

/**
 * `st.fixedString` stores a fixed length string, note the length denotes byte length not
 *
 * ---
 * ```ts
 * const User = st.object({
 *     id: st.fixedString(8)
 * })
 * ```
 *
 * @group String / Bytes
 */
export function fixedString(size: number): Serializer<string> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    return {
        size,
        write(ctx, value) {
            if (typeof value !== "string") throw new Error("Expected String");

            const data = encoder.encode(value);
            if (data.byteLength !== size)
                throw new Error(`String has invalid size: ${data.byteLength}`);

            ctx.reserve(size);
            ctx.bytes.set(data, ctx.offset);
            ctx.offset += size;
        },
        read(ctx) {
            const section = new Uint8Array(ctx.buffer, ctx.offset, size);
            ctx.offset += size;
            return decoder.decode(section);
        },
    };
}
