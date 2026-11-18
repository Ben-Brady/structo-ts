import { st } from "../../index.ts";

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
export function array<T>(
    length: st.Serializer<number>,
    type: st.Serializer<T>,
): st.Serializer<T[]> {
    return {
        estimateSize: (value) => {
            const lengthSize = st.estimateSize(length, value.length);
            if (type.size) {
                const contentSize = value.length * type.size;
                return lengthSize + contentSize;
            } else if (type.estimateSize) {
                let contentSize = 0;
                for (const element of value) {
                    contentSize += type.estimateSize(element);
                }
                return lengthSize + contentSize;
            } else {
                return lengthSize;
            }
        },
        write: (ctx, value) => {
            length.write(ctx, value.length);
            if (type.size) {
                ctx.reserve(value.length * type.size);
            }

            for (let i = 0; i < value.length; i++) {
                ctx.pushPath(i);
                type.write(ctx, value[i]);
                ctx.popPath();
            }
        },
        read: (ctx) => {
            const size = length.read(ctx);
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

/**
 * @deprecated use `array`
 * @hidden
 */
export const list = array;
