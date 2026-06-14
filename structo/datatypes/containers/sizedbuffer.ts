import type { Serializer } from "../../types";

export function sizedBuffer(length: Serializer<number>): Serializer<ArrayBuffer> {
    return {
        write: (ctx, value) => {
            length.write(ctx, value.byteLength);

            const bytes = new Uint8Array(value);
            ctx.alloc(value.byteLength);
            new Uint8Array(ctx.view.buffer).set(bytes, ctx.offset);
            ctx.offset += value.byteLength;
        },
        read: (ctx) => {
            const size = length.read(ctx);
            const slice = ctx.buffer.slice(ctx.offset, ctx.offset + size);
            ctx.offset += size;
            return slice;
        },
    };
}
