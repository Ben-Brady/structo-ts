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
    const SHOW_ERRORS = size < 4096;
    const { read: readType, write: writeType, size: typeSize } = type;

    return {
        size: type.size ? size * type.size : undefined,
        write: (ctx, value) => {
            if (value.length !== size) throw new Error("Invalid Size");

            if (typeSize) ctx.alloc(size * typeSize);
            for (let i = 0; i < size; i++) {
                if (SHOW_ERRORS) ctx.stack.push(`[${i}]`);
                writeType(ctx, value[i]);
                if (SHOW_ERRORS) ctx.stack.pop();
            }
        },
        read: (ctx) => {
            const arr = new Array(size);

            for (let i = 0; i < size; i++) {
                if (SHOW_ERRORS) ctx.stack.push(`[${i}]`);
                arr[i] = readType(ctx);
                if (SHOW_ERRORS) ctx.stack.pop();
            }
            return arr;
        },
    };
}
