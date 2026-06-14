import type { Serializer } from "../../types";

export function byteLiteral(bytes: number[]): Serializer<number[]> {
    const length = bytes.length;

    return {
        size: bytes.length,
        read: (ctx) => {
            const arr = new Uint8Array(ctx.view.buffer);

            for (let i = 0; i < length; i++) {
                if (arr[ctx.offset + i] !== bytes[i]) {
                    throw new Error("Invalid Value");
                }
            }
            ctx.offset += length;
            return bytes;
        },
        write(ctx) {
            new Uint8Array(ctx.view.buffer).set(bytes, ctx.offset);
            ctx.offset += length;
        },
    };
}
