import { Serializer } from "../../types";

export function transform<T>(callback: (value: T) => T) {
    return (type: Serializer<T>): Serializer<T> => ({
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
