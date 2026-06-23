import type { Serializer } from "../../types.js";

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
            const TRACK_STACK = value.length < 1000;

            if (type.size) {
                ctx.reserve(value.length * type.size);
            }

            for (let i = 0; i < value.length; i++) {
                if (TRACK_STACK) ctx.path.push(`[${i}]`);
                const v = value[i];
                type.write(ctx, v);
                if (TRACK_STACK) ctx.path.pop();
            }
        },
        read: (ctx) => {
            const size = length.read(ctx);
            const TRACK_STACK = size < 1000;

            const arr = new Array(size);
            for (let i = 0; i < size; i++) {
                if (TRACK_STACK) ctx.path.push(`[${i}]`);
                arr[i] = type.read(ctx);
                if (TRACK_STACK) ctx.path.pop();
            }
            return arr;
        },
    };
}
