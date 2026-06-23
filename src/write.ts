import type { WriterContext, Serializer } from "./types.js";

export function write<TIn, TOut>(serializer: Serializer<TIn, TOut>, value: TIn): ArrayBuffer {
    let byteLength = serializer.size ?? 4096;
    let buffer_ = new ArrayBuffer(byteLength);

    let ctx: WriterContext<ArrayBuffer> = {
        path: [],
        offset: 0,
        buffer: buffer_,
        bytes: new Uint8Array(buffer_),
        view: new DataView(buffer_),
        reserve: (length: number) => {
            if (length <= 0) return;
            while (ctx.offset + length > byteLength) {
                byteLength *= 2;
                ctx.buffer = ctx.buffer.transfer(byteLength);
                ctx.view = new DataView(ctx.buffer);
                ctx.bytes = new Uint8Array(ctx.buffer);
            }
        },
    };

    if (serializer.size) {
        ctx.reserve = (length: number) => {
            if (ctx.offset + length > byteLength) {
                throw new Error("Attempted to allocate space when writing into buffer");
            }
        };
    }

    try {
        serializer.write(ctx, value);
    } catch (e) {
        const path = ctx.path.length === 0 ? "root" : "value" + ctx.path.join("");
        throw new Error(`Serialization error at ${path}`, { cause: e });
    }

    if (ctx.buffer.byteLength === ctx.offset) {
        return ctx.buffer;
    } else {
        return ctx.buffer.transferToFixedLength(ctx.offset);
    }
}

export function writeInto<TIn, TOut, TBuffer extends ArrayBuffer | SharedArrayBuffer>(
    buffer: TBuffer,
    offset: number,
    serializer: Serializer<TIn, TOut>,
    value: TIn,
) {
    let ctx = {
        path: [],
        offset: offset,
        buffer: buffer,
        bytes: new Uint8Array(buffer),
        view: new DataView(buffer),
        reserve(length: number) {
            if (ctx.offset + length > ctx.buffer.byteLength) {
                throw new Error("Attempted to allocate space when writing into buffer");
            }
        },
    } as WriterContext<TBuffer>;

    try {
        serializer.write(ctx, value);
    } catch (e) {
        const path = ctx.path.join("") ?? "root";
        throw new Error(`Serialization error at value${path}`, { cause: e });
    }
}
