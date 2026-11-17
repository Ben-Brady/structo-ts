import { st } from "../../../src/index.ts";

const SCATCH_SIZE = 1024 * 32;

export function string(length: st.Serializer<number>): st.Serializer<string> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const scratch = new Uint8Array(SCATCH_SIZE * 2);

    return {
        write: (ctx, value) => {
            if (typeof value !== "string") throw new Error("Expected String");

            let bytes: Uint8Array;
            if (value.length > SCATCH_SIZE) {
                bytes = encoder.encode(value);
            } else {
                const written = encoder.encodeInto(value, scratch).written;
                bytes = scratch.subarray(0, written);
            }

            const size = bytes.byteLength;
            const lengthSize = length.size ?? 0;

            ctx.reserve(size + lengthSize);
            length.write(ctx, size);
            ctx.bytes.set(bytes, ctx.offset);
            ctx.offset += size;
        },
        read: (ctx) => {
            const size = length.read(ctx);

            const section = new Uint8Array(ctx.buffer, ctx.offset, size);
            ctx.offset += size;
            return decoder.decode(section);
        },
    };
}
