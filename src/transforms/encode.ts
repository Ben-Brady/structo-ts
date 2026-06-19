import type { Serializer } from "../types";
import type { Transform } from "./pipe";

export function encode<TIn, TOut>(options: {
    encode: (value: TOut) => TIn;
    decode: (value: TIn) => TOut;
}): Transform<TOut, TIn> {
    const { encode, decode } = options;
    return (type: Serializer<TIn>) =>
        ({
            size: type.size,
            read: (ctx) => decode(type.read(ctx)),
            write: (ctx, value) => type.write(ctx, encode(value)),
        }) satisfies Serializer<TOut>;
}
