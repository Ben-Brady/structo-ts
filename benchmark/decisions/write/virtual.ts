import type { st } from "../../../src/index.ts";

const buffer = new ArrayBuffer(0, { maxByteLength: 1024 * 1024 * 1024 });
const bytes = new Uint8Array(buffer);
const view = new DataView(buffer);

export function write<T>(serializer: st.Serializer<T>, value: T): ArrayBuffer {
    let initialSize = serializer.size ?? serializer.estimateSize?.(value);
    let byteLength = initialSize || 4096;
    if (buffer.byteLength < byteLength) {
        buffer.resize(byteLength);
    }

    const ctx: st.WriterContext<ArrayBuffer> = {
        offset: 0,
        buffer,
        bytes,
        view,
        pushPath: () => {},
        popPath: () => {},
        reserve: (length: number) => {
            if (length <= 0) return;
            while (ctx.offset + length > byteLength) {
                byteLength *= 2;
                buffer.resize(byteLength);
            }
        },
    };

    serializer.write(ctx, value);
    return ctx.bytes.slice(0, ctx.offset).buffer;
}
