import type { WriterContext, Serializer } from "./types.ts";

/**
 * The options used for `write`
 *
 * @group Functions
 */
export interface WriteOptions {
    /**
     * The amount of space to allocate in advance
     *
     * This is overriden if the full size is statically known
     */
    initialSize?: number;

    /**
     * Disable error reporting
     *
     * This can be useful to gain a small amount of performance
     */
    disableErrorReporting?: boolean;
}
/**
 * The options used for `writeInto`
 *
 * @group Functions
 */
export interface WriteIntoOptions {
    /**
     * Disable error reporting
     */
    disabledErrorReporting?: boolean;
}

/**
 * Writes a schema into a newly allocated `ArrayBuffer`.
 *
 * ---
 *
 * ```ts
 * const User = st.object({
 *     name: st.string(st.u8()),
 *     age: st.u32(),
 * })
 *
 * const data = st.write(User, {
 *     name: "nnilky",
 *     age: 26,
 * })
 * ```
 *
 * @group Functions
 */
export function write<TIn, TOut>(
    serializer: Serializer<TIn, TOut>,
    value: TIn,
    options?: WriteOptions,
): ArrayBuffer {
    let byteLength = serializer.size ?? options?.initialSize ?? 4096;

    const path: (string | number)[] = [];
    let buffer = new ArrayBuffer(byteLength);
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
                buffer = buffer.transfer(byteLength);
                ctx.buffer = buffer;
                ctx.view = new DataView(buffer);
                ctx.bytes = new Uint8Array(buffer);
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
    } catch (err) {
        throwSerializationError(err, path);
    }

    if (ctx.buffer.byteLength !== ctx.offset) {
        ctx.buffer = ctx.buffer.transferToFixedLength(ctx.offset);
    }

    return ctx.buffer;
}

/**
 * Writes data into an existing `ArrayBuffer`, this is used to edit existing data without a copy.
 *
 * Additionally, it can be used to reduce garbage collection by reusing a buffer.
 *
 * ---
 *
 * ```ts
 * const User = st.object({
 *     name: st.pipe(st.fixedBytes(16), st.toAscii()),
 *     age: st.u32(),
 * })
 *
 * const buffer = new ArrayBuffer(32)
 * st.writeInto(buffer, 0, User, {
 *     name: "nnilky",
 *     age: 26
 * })
 * st.writeInto(buffer, 16, User, {
 *     name: "August",
 *     age: 22
 * })
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
    } catch (err) {
        throwSerializationError(err, path);
    }
}

function throwSerializationError(err: any, path: (string | number)[]) {
    let pathStr = path.map((v) => `[${v}]`).join("");
    throw new Error(
        `Serialization error at value${pathStr}: \n${err}`, //
        { cause: err },
    );
}
