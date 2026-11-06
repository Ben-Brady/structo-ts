import type { WriterContext, Serializer } from "./types.ts";

/**
 * Writes data into an `ArrayBuffer` using a schema.
 *
 * ```ts
 * const schema = st.object({
 *     name: st.string(st.u8()),
 *     age: st.u32(),
 * })
 * const user = { name: "nnilky", age: 25 }
 *
 * const data = st.write(schema, user)
 * ```
 */
export function write<TIn, TOut>(serializer: Serializer<TIn, TOut>, value: TIn): ArrayBuffer {
    let byteLength = serializer.size ?? 4096;
    let buffer = new ArrayBuffer(byteLength);

    const path: (string | number)[] = [];

    let ctx: WriterContext<ArrayBuffer> = {
        buffer,
        bytes: new Uint8Array(buffer),
        view: new DataView(buffer),
        offset: 0,
        pushPath: (key) => path.push(key),
        popPath: () => path.pop(),
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
        const pathStr =
            path.length === 0
                ? "root" //
                : "value" + path.map((v) => `[${v}]`).join("");
        throw new Error(`Serialization error at ${pathStr}`, { cause: e });
    }

    if (ctx.buffer.byteLength === ctx.offset) {
        return ctx.buffer;
    } else {
        return ctx.buffer.transferToFixedLength(ctx.offset);
    }
}

/**
 * Writes data into an existing `ArrayBuffer`, this is used to edit existing data without a copy.
 *
 * ```ts
 * const buffer: ArrayBuffer = ...
 * const schema = st.object({
 *     name: st.string(st.u8()),
 *     age: st.u32(),
 * })
 * const user = { name: "nnilky", age: 25 }
 *
 * const data = st.writeInto(buffer, 16, schema, user)
 * ```
 */
export function writeInto<TIn, TOut, TBuffer extends ArrayBuffer | SharedArrayBuffer>(
    buffer: TBuffer,
    offset: number,
    serializer: Serializer<TIn, TOut>,
    value: TIn,
) {
    const path: (string | number)[] = [];
    let ctx = {
        offset: offset,
        buffer: buffer,
        bytes: new Uint8Array(buffer),
        view: new DataView(buffer),
        pushPath: (key) => path.push(key),
        popPath: () => path.pop(),
        reserve(length: number) {
            if (ctx.offset + length > ctx.buffer.byteLength) {
                throw new Error("Attempted to allocate space when writing into an existing buffer");
            }
        },
    } as WriterContext<TBuffer>;

    try {
        serializer.write(ctx, value);
    } catch (e) {
        const pathStr =
            path.length === 0
                ? "root" //
                : "value" + path.map((v) => `[${v}]`).join("");
        throw new Error(`Serialization error at value${pathStr}`, { cause: e });
    }
}
