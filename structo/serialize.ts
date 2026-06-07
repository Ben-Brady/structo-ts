import type { SerializationContext, SerializerOnly } from "./types";

export function serialize<T>(serializer: SerializerOnly<T>, value: T): ArrayBuffer {
    const buffer = new ArrayBuffer(16, { maxByteLength: 10000 });

    const ctx: SerializationContext = {
        offset: 0,
        buffer,
        view: new DataView(buffer),
        requestSpace(length) {
            if (this.offset + length < buffer.byteLength) return;
            buffer.resize(buffer.byteLength * 2);
        },
    };
    serializer.serialize!(ctx, value);
    buffer.resize(ctx.offset);
    return buffer;
}
