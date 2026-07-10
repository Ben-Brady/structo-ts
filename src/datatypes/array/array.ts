import type { Serializer } from "../../types.ts";

/**
 * `st.array` is a fixed length array, akin to a C array.
 *
 * ```
 * st.array(16, st.f64())
 * ```
 *
 */
export function array<T>(size: number, type: Serializer<T>): Serializer<T[]> {
    return {
        size: type.size ? size * type.size : undefined,
        write: (ctx, value) => {
            if (value.length !== size) throw new Error("Invalid Size");

            if (type.size) ctx.reserve(size * type.size);
            for (let i = 0; i < size; i++) {
                ctx.pushPath?.(i);
                type.write(ctx, value[i]);
                ctx.popPath?.();
            }
        },
        read: (ctx) => {
            const arr = new Array(size);

            for (let i = 0; i < size; i++) {
                ctx.pushPath?.(i);
                arr[i] = type.read(ctx);
                ctx.popPath?.();
            }
            return arr;
        },
    };
}
