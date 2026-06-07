import type { Serializer } from "../../types";

export function buffer( size: number): Serializer<ArrayBuffer> {
    return {
        write: (ctx, value) => {
            const bytes = new Uint8Array(value);
            if (bytes.length !== size) {
                throw new Error("Invalid Length");
            }

            ctx.requestSpace(bytes.length);
            new Uint8Array(ctx.buffer).set(bytes, ctx.offset);
            ctx.offset += size;
        },
        read: (ctx) => {
            const slice = ctx.buffer.slice(ctx.offset, ctx.offset + size);
            ctx.offset += size;
            return slice;
        },
    };
}
