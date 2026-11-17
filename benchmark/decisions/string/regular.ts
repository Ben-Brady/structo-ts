import { st } from "../../../src/index.ts";

export function string(length: st.Serializer<number>): st.Serializer<string> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    return {
        write: (ctx, value) => {
            if (typeof value !== "string") throw new Error("Expected String");
            const bytes = encoder.encode(value);
            const lengthSize = length.size ?? 0;

            ctx.reserve(bytes.byteLength + lengthSize);
            length.write(ctx, bytes.byteLength);
            ctx.bytes.set(bytes, ctx.offset);
            ctx.offset += bytes.byteLength;
        },
        read: (ctx) => {
            const size = length.read(ctx);

            const section = new Uint8Array(ctx.buffer, ctx.offset, size);
            ctx.offset += size;
            return decoder.decode(section);
        },
    };
}
