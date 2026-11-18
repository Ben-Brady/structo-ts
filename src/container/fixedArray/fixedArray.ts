import { st } from "../../index.ts";

/**
 * `st.fixedArray` is a fixed length array, akin to a C array.
 *
 * ```ts
 * st.fixedArray(16, st.f64())
 * ```
 *
 * @group Array
 */
export function fixedArray<T>(size: number, type: st.Serializer<T>): st.Serializer<T[]> {
    return {
        size: type.size ? size * type.size : undefined,
        estimateSize: (value) => {
            let total = 0;
            for (const v of value) {
                total += st.estimateSize(type, v);
            }
            return total;
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
