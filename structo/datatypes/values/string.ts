import type { Serializer } from "../../types";

export function string(length: Serializer<number>): Serializer<string> {
    const { read: readLength, write: writeLength } = length;
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    return {
        write: (ctx, value) => {
            const bytes = encoder.encode(value);

            writeLength(ctx, bytes.byteLength);

            ctx.alloc(bytes.byteLength);

            const arr = new Uint8Array(ctx.view.buffer);
            arr.set(bytes, ctx.offset);

            ctx.offset += bytes.byteLength;
        },
        read: (ctx) => {
            const length = readLength(ctx);
            const section = ctx.buffer.slice(ctx.offset, ctx.offset + length);
            ctx.offset += length;
            return decoder.decode(section);
        },
    };
}
