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
            if (value.length !== size) throw new Error("Invalid Size");

            ctx.reserve(size);
            const target = new Uint8Array(ctx.buffer, ctx.offset, size);
            encoder.encodeInto(value, target);
            ctx.offset += size;
        },
        read(ctx) {
            const target = new Uint8Array(ctx.buffer, ctx.offset, size);
            const output = decoder.decode(target);
            ctx.offset += size;
            return output;
        },
    };
}
