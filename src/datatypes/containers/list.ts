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
            const TRACK_STACK = value.length < 4096;

            if (type.size) {
                ctx.alloc(value.length * type.size);
            }

            for (let i = 0; i < value.length; i++) {
                if (TRACK_STACK) ctx.stack.push(`[${i}]`);
                const v = value[i];
                type.write(ctx, v);
                if (TRACK_STACK) ctx.stack.pop();
            }
        },
        read: (ctx) => {
            const size = length.read(ctx);
            const TRACK_STACK = size < 4096;

            const arr = new Array(size);
            for (let i = 0; i < size; i++) {
                if (TRACK_STACK) ctx.stack.push(`[${i}]`);
                arr[i] = type.read(ctx);
                if (TRACK_STACK) ctx.stack.pop();
            }
            return arr;
        },
    };
}
