import type { Serializer } from "../types";
import type { Transform } from "./pipe";

export function modify<T>(callback: (value: T) => T): Transform<T> {
    return (type: Serializer<T>): Serializer<T> => ({
        size: type.size,
        read: (ctx) => callback(type.read(ctx)),
        write: (ctx, value) => type.write(ctx, callback(value)),
    });
}
