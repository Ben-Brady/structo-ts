import { st } from "../../../src/index.ts";

export function string(length: st.Serializer<number>): st.Serializer<string> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    return {
        write: (ctx, value) => {
            if (typeof value !== "string") throw new Error("Expected String");

            ctx.reserve(length.size! + value.length * 2);

            const target = new Uint8Array(ctx.buffer, ctx.offset + length.size!, value.length * 2);
            const written = encoder.encodeInto(value, target).written;
            length.write(ctx, written);
            ctx.offset += written;
        },
        read: (ctx) => {
            const size = length.read(ctx);

            const section = new Uint8Array(ctx.buffer, ctx.offset, size);
            ctx.offset += size;
            return decoder.decode(section);
        },
    };
}
