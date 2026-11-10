import type { Serializer } from "../../types.ts";

/**
 * `st.array` is a dynamically sized array
 *
 * Note: Length is read/writen first, then the values in order
 *
 * ```
 * st.array(st.u32(), User)
 * ```
 *
 * @group Array
 *
 */
export function array<TIn, TOut>(
    length: Serializer<number>,
    type: Serializer<TIn, TOut>,
): Serializer<TIn[], TOut[]> {
    return {
        write: (ctx, value) => {
            length.write(ctx, value.length);
            if (type.size) {
                ctx.reserve(value.length * type.size);
            }

            for (let i = 0; i < value.length; i++) {
                ctx.pushPath?.(i);
                const v = value[i];
                type.write(ctx, v);
                ctx.popPath?.();
            }
        },
        read: (ctx) => {
            const size = length.read(ctx);
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

/**
 * @deprecated use `array`
 * @hidden
 */
export const list = array;
