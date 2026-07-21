import type { Transform } from "../pipe.js";

export function encode<TIn, TOut>(options: {
    encode: (value: TIn) => TOut;
    decode: (value: TOut) => TIn;
}): Transform<TIn, TOut> {
    const { encode, decode } = options;
    return (type) => ({
        size: type.size,
        read: (ctx) => decode(type.read(ctx)),
        write: (ctx, value) => type.write(ctx, encode(value)),
    });
}
