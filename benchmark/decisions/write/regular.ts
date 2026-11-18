import type { Serializer, WriterContext } from "../types.ts";

export function write<T>(serializer: Serializer<T>, value: T): ArrayBuffer {
    const growthFactor = 1.5;

    let initialSize = serializer.size ?? serializer.estimateSize?.(value);
    let byteLength = initialSize || 4096;
    if (Number.isNaN(initialSize)) {
        console.error("Got NaN from size or estimateSize, ");
        console.error(serializer);
        byteLength = 4096;
    }

    const initialBuffer = new ArrayBuffer(byteLength);

    const ctx: WriterContext<ArrayBuffer> = {
        offset: 0,
        buffer: initialBuffer,
        bytes: new Uint8Array(initialBuffer),
        view: new DataView(initialBuffer),

        pushPath: () => {},
        popPath: () => {},

        reserve: (length: number) => {
            if (length <= 0) return;
            while (ctx.offset + length > byteLength) {
                byteLength = Math.ceil(byteLength * growthFactor);
                ctx.buffer = ctx.buffer.transfer(byteLength);
                ctx.view = new DataView(ctx.buffer);
                ctx.bytes = new Uint8Array(ctx.buffer);
            }
        },
    };

    serializer.write(ctx, value);

    if (ctx.buffer.byteLength === ctx.offset) {
        return ctx.buffer;
    } else {
        return ctx.buffer.transfer(ctx.offset);
    }
}
