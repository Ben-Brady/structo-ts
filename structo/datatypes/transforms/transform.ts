import { Serializer } from "../../types";

export function transform<T, TOut = T>(callback: (value: T) => TOut) {
    return (type: Serializer<T>): Serializer<TOut> => ({
        read(ctx) {
            const value = type.read(ctx);
            return callback(value);
        },
        write(ctx, value) {
            value = callback(value);
            type.write(ctx, value);
        },
    });
}
