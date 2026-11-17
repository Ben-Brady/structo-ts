import type { Serializer } from "../../types.ts";

/**
 * `st.fixedArray` is a fixed length array, akin to a C array.
 *
 * ```ts
 * st.fixedArray(16, st.f64())
 * ```
 *
 * @group Array
 */
export function fixedArray<T>(size: number, type: Serializer<T>): Serializer<T[]> {
    return {
        size: type.size ? size * type.size : undefined,
        estimateSize: (value) => {
            if (!type.estimateSize) return 0;
            return value //
                .reduce((total, v) => total + type.estimateSize!(v), 0);
        },
        write: (ctx, value) => {
            if (value.length !== size) {
                throw new Error(`Expected ${size} length, got ${value.length}`);
            }

            for (let i = 0; i < size; i++) {
                // ctx.pushPath(i);
                type.write(ctx, value[i]);
                // ctx.popPath();
            }
        },
        read: (ctx) => {
            const arr = new Array(size);

            for (let i = 0; i < size; i++) {
                ctx.pushPath(i);
                arr[i] = type.read(ctx);
                ctx.popPath();
            }
            return arr;
        },
    };
}
