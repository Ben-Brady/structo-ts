import type { Serializer } from "../../types.ts";

/**
 * `st.bytes(st.u32())`, a dynamic amount of bytes prefixed with it's length
 *
 * This is very similar to a string, except the contents are not decoded
 *
 * `readBehaviour` describes how to retrive the data:
 * - `copy` returns a UInt8Array with a newly allocating ArrayBuffer
 * - `reference` returns a UInt8Array reference the original data
 *
 * Reference can reduce memory usage by preventing new allocations,
 * however it requires the original data to remain. Meaning if your
 * only using a small subsection it will actual use more memory.
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
export function bytes(
    length: Serializer<number>,
    readBehaviour: "copy" | "reference" = "copy",
): Serializer<Uint8Array> {
    return {
        write: (ctx, value) => {
            length.write(ctx, value.byteLength);

            ctx.reserve((length.size ?? 0) + value.byteLength);
            ctx.bytes.set(value, ctx.offset);
            ctx.offset += value.byteLength;
        },
        read: (ctx) => {
            const size = length.read(ctx);

            const slice =
                readBehaviour === "copy"
                    ? ctx.bytes.slice(ctx.offset, ctx.offset + size)
                    : ctx.bytes.subarray(ctx.offset, ctx.offset + size);
            ctx.offset += size;
            return slice;
        },
    };
}
