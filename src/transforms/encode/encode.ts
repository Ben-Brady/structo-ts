import type { Pipeline } from "../pipe.ts";

/**
 * @group Pipeline
 */
export function encode<TIn, TOut>(options: {
    encode: (value: TIn) => TOut;
    decode: (value: TOut) => TIn;
}): Pipeline<TIn, TOut> {
    const { encode, decode } = options;
    return (type) => ({
        size: type.size,
        read: (ctx) => decode(type.read(ctx)),
        write: (ctx, value) => type.write(ctx, encode(value)),
    });
}
