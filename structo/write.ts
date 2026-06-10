import type { WriterContext, Serializer } from "./types";

export function write<T>(serializer: Serializer<T>, value: T): ArrayBuffer {
    const ctx = createdWriterContext();
    serializer.write!(ctx, value);
    return ctx.buffer.transferToFixedLength(ctx.offset);
}

export function createdWriterContext(): WriterContext {
    let buffer = new ArrayBuffer(64);

    return {
        offset: 0,
        buffer,
        view: new DataView(buffer),
        requestSpace(length) {
            while (this.offset + length >= this.buffer.byteLength) {
                this.buffer = this.buffer.transferToFixedLength(this.buffer.byteLength * 2);
                this.view = new DataView(this.buffer);
            }
        },
    };
}
