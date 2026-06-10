import type { Serializer } from "../../types";

export function sizedBuffer(options: { length: Serializer<number> }): Serializer<ArrayBuffer> {
    return {
        write(ctx, value) {
            options.length.write(ctx, value.byteLength);

            const bytes = new Uint8Array(value);
            ctx.requestSpace(value.byteLength);
            new Uint8Array(ctx.view.buffer).set(bytes, ctx.offset);
            ctx.offset += value.byteLength;
        },
        read(ctx) {
            const length = options.length.read(ctx);
            const slice = ctx.buffer.slice(ctx.offset, ctx.offset + length);
            ctx.offset += length;
            return slice;
        },
    };
}
