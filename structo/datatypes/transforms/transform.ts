import { Serializer } from "../../types";

export function transform<T>(
    callback: (value: T) => T,
    type: Serializer<T>, //
): Serializer<T> {
    return {
        read(ctx) {
            const value = type.read(ctx);
            return callback(value);
        },
        write(ctx, value) {
            value = callback(value);
            type.write(ctx, value);
        },
    };
}
