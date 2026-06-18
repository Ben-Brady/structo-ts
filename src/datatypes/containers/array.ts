import type { Serializer } from "../../types";

/**
 * `st.array` is a fixed length array, akin to a C array.
 *
 * ```
 * st.array(16, st.f64())
 * ```
 *
 */
export function array<T>(size: number, type: Serializer<T>): Serializer<T[]> {
    const { read: readType, write: writeType, size: typeSize } = type;

    return {
        size: type.size ? size * type.size : undefined,
        write: (ctx, value) => {
            if (value.length !== size) throw new Error("Invalid Size");

            if (typeSize) ctx.alloc(size * typeSize);
            for (let i = 0; i < size; i++) {
                writeType(ctx, value[i]);
            }
        },
        read: (ctx) => {
            const arr = new Array(size);

            for (let i = 0; i < size; i++) {
                arr[i] = readType(ctx);
            }
            return arr;
        },
    };
}
