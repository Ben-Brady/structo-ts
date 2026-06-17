import type { Serializer } from "../../types";

export function string(length: Serializer<number>): Serializer<string> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const lengthSize = length.size ?? 0;
    return {
        write: (ctx, value) => {
            if (typeof value !== "string") throw new Error("Expected String to encoder");
            const bytes = encoder.encode(value);

            const size = bytes.byteLength;
            ctx.alloc(size + lengthSize);

            length.write(ctx, size);
            const arr = new Uint8Array(ctx.buffer, ctx.offset);
            arr.set(bytes);
            ctx.offset += size;
        },
        read: (ctx) => {
            const size = length.read(ctx);
            const section = ctx.buffer.slice(ctx.offset, ctx.offset + size);
            ctx.offset += size;
            return decoder.decode(section);
        },
    };
}
