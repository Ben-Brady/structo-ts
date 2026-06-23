import type { Serializer } from "../../types.js";

export function sizedBytes(length: Serializer<number>): Serializer<Uint8Array> {
    return {
        write: (ctx, value) => {
            length.write(ctx, value.byteLength);

            ctx.reserve(value.byteLength);
            ctx.bytes.set(value, ctx.offset);
            ctx.offset += value.byteLength;
        },
        read: (ctx) => {
            const size = length.read(ctx);

            const slice = ctx.bytes.subarray(ctx.offset, ctx.offset + size);
            ctx.offset += size;
            return slice;
        },
    };
}
