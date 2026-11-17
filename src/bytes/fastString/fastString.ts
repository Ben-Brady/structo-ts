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
        estimateSize: (value) => value.length + st.estimateSize(length, value.length),
        write: (ctx, value) => {
            if (typeof value !== "string") throw new Error("Expected String");

            let stringOffset = ctx.offset + length.size!;

            // assume 1 byte per character
            ctx.reserve(length.size! + value.length);
            let target = new Uint8Array(ctx.buffer, stringOffset, value.length);
            let { written, read } = encoder.encodeInto(value, target);

            // try again with 2 bytes per character
            if (read < value.length) {
                // TODO: use read to know exactly how much extra space to allocate instead of assuming value.length * 2
                ctx.reserve(length.size! + value.length * 2);
                let target = new Uint8Array(ctx.buffer, stringOffset, value.length * 2);
                written = encoder.encodeInto(value, target).written;
            }

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
