import type { WriterContext, Serializer } from "./types";

export function write<T>(serializer: Serializer<T>, value: T): ArrayBuffer {
    const ctx = createdWriterContext(serializer);
    serializer.write(ctx, value);

    if (ctx.buffer.byteLength === ctx.offset) {
        return ctx.buffer;
    } else {
        return ctx.buffer.transfer(ctx.offset);
    }
}

export function createdWriterContext(type: Serializer<any>): WriterContext {
    if (type.size) {
        let buffer = new ArrayBuffer(type.size);
        const view = new DataView(buffer);
        return {
            offset: 0,
            buffer,
            view,
            alloc: Function.prototype as () => void,
        };
    } else {
        let bufferLength = 64;
        let buffer = new ArrayBuffer(bufferLength);
        const view = new DataView(buffer);
        return {
            offset: 0,
            buffer,
            view,
            alloc(length) {
                if (length < 0) return;

                while (this.offset + length >= bufferLength) {
                    bufferLength = this.buffer.byteLength * 2;
                    this.buffer = this.buffer.transfer(bufferLength);
                    this.view = new DataView(this.buffer);
                }
            },
        };
    }
}
