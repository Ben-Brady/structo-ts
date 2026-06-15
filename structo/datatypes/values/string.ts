import type { Serializer } from "../../types";

export function string(length: Serializer<number>): Serializer<string> {
    const { read: readLength, write: writeLength, size: lengthSize = 0 } = length;
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    return {
        write: (ctx, value) => {
            const bytes = encoder.encode(value);

            const length = bytes.byteLength;
            ctx.alloc(length + lengthSize);

            writeLength(ctx, length);
            const arr = new Uint8Array(ctx.buffer, ctx.offset);
            arr.set(bytes);
            ctx.offset += length;
        },
        read: (ctx) => {
            const length = readLength(ctx);
            const section = ctx.buffer.slice(ctx.offset, ctx.offset + length);
            ctx.offset += length;
            return decoder.decode(section);
        },
    };
}
