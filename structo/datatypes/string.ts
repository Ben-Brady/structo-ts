import type { Serializer } from "../types";

export function string(options: { length: Serializer<number> }): Serializer<string> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    return {
        serialize: (ctx, value) => {
            const data = encoder.encode(value);
            options.length.serialize(ctx, data.byteLength);

            ctx.requestSpace(data.byteLength);
            const arr = new Uint8Array(ctx.buffer);
            arr.set(data, ctx.offset);

            ctx.offset += data.byteLength;
        },
        deserialize: (ctx) => {
            const length = options.length.deserialize(ctx);
            const section = ctx.view.buffer.slice(ctx.offset, ctx.offset + length);
            ctx.offset += length;
            return decoder.decode(section);
        },
    };
}
