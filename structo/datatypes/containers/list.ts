import type { Serializer } from "../../types";

export function list<T>(options: {
    type: Serializer<T>;
    length: Serializer<number>;
}): Serializer<T[]> {
    return {
        write: (ctx, value) => {
            options.length.write(ctx, value.length);
            value.forEach((v) => options.type.write(ctx, v));
        },
        read: (ctx) => {
            const length = options.length.read(ctx);
            return Array.from(
                { length }, //
                () => options.type.read(ctx),
            );
        },
    };
}
