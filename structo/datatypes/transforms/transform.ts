import type { Serializer } from "../../types";

export function transform<T>(callback: (value: T) => T) {
    return (type: Serializer<T>): Serializer<T> => ({
        size: type.size,
        read: (ctx) => {
            const value = type.read(ctx);
            return callback(value);
        },
        write: (ctx, value) => {
            let outValue = callback(value);
            type.write(ctx, outValue);
        },
    });
}
