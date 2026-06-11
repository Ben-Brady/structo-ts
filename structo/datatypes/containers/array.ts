import type { Serializer } from "../../types";

export function array<T>(size: number, type: Serializer<T>): Serializer<T[]> {
    return {
        write(ctx, value) {
            if (value.length !== size) {
                throw new Error("Invalid Size");
            }

            value.forEach((v) => type.write(ctx, v));
        },
        read(ctx) {
            return Array.from(
                { length: size }, //
                () => type.read(ctx),
            );
        },
    };
}
