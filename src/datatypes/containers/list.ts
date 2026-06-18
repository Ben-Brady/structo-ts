import type { Serializer } from "../../types";

/**
 * `st.list` is a dynamically sized array
 *
 * Note: Length is read/writen first, then the values in order
 *
 * ```
 * st.list(st.u32(), User)
 * ```
 *
 */
export function list<T>(length: Serializer<number>, type: Serializer<T>): Serializer<T[]> {
    return {
        write: (ctx, value) => {
            length.write(ctx, value.length);

            if (type.size) ctx.alloc(value.length * type.size);
            for (const v of value) {
                type.write(ctx, v);
            }
        },
        read: (ctx) => {
            const size = length.read(ctx);

            const arr = new Array(size);
            for (let i = 0; i < size; i++) {
                arr[i] = type.read(ctx);
            }
            return arr;
        },
    };
}
