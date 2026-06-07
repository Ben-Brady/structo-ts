import type { Serializer } from "../../types";

export function array<T>(options: { type: Serializer<T>; size: number }): Serializer<T[]> {
    return {
        write: (ctx, value) => {
            if (value.length !== options.size) {
                throw new Error("Invalid Size");
            }

            value.forEach((v) => options.type.write(ctx, v));
        },
        read: (ctx) => {
            return Array.from(
                { length: options.size }, //
                () => options.type.read(ctx),
            );
        },
    };
}
