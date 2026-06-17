import type { Serializer } from "../../types";
import type { Transform } from "./pipe";

export function encode<TIn, TOut>(
    encodeTo: (value: TIn) => TOut,
    encodeFrom: (value: TOut) => TIn,
): Transform<TOut, TIn> {
    return (type: Serializer<TIn>) =>
        ({
            size: type.size,
            read: (ctx) => encodeTo(type.read(ctx)),
            write: (ctx, value) => type.write(ctx, encodeFrom(value)),
        }) satisfies Serializer<TOut>;
}
