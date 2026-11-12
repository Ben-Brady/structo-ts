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
    const decoder = new TextDecoder();

    // use a scratch buffer to avoid creating garbage
    // Note: update tests when modifying scratch length
    const scratch = new Uint8Array(1024);

    return {
        write: (ctx, value) => {
            if (typeof value !== "string") throw new Error("Expected String");

            let bytes: Uint8Array;
            if (value.length * 2 < scratch.length) {
                bytes = encoder.encode(value);
            } else {
                const { written } = encoder.encodeInto(value, scratch);
                bytes = scratch.subarray(0, written);
            }

            const size = bytes.byteLength;
            const lengthSize = length.size ?? 0;

            ctx.reserve(size + lengthSize);
            length.write(ctx, size);
            ctx.bytes.set(bytes, ctx.offset);
            ctx.offset += size;
        },
        read: (ctx) => {
            const size = length.read(ctx);

            const section = new Uint8Array(ctx.buffer, ctx.offset, size);
            ctx.offset += size;
            return decoder.decode(section);
        },
    };
}

/*
Implementation Note: Why not use encoder.encodeInto?

It would be nice to be able to use encoder.encodeInto
as it avoid having to make a copy of the data. But supporting
variable width encoded lengths and UTF-16 makes this hard.

enocdeInto doesn't allow you to know how much space the output will
used before you encode it. This means you need to allocate the upper
bound possible, which is 2 * length (since string.length represents
the UTF-16 size). This means in most cases, your allocating more data
than is needed before you encode the data since you need to assume it's
all 2 byte characters.

Additionally, since you need to write the data before you have the length,
you have to know how much space to leave for length. This means you cannot
support variable width encoded lengths, since you have no knowledge of the
space they need to store the final length.

These complexities make it too annoying to use encodeInto. It's possible to
use it, but it makes the API much more constrained.
*/
