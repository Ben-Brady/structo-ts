import { st } from "../../index.ts";

/**
 * `st.exhaustiveArray` does not store it's size, instead reading until the end of the `ArrayBuffer`
 *
 * This means it cannot be nested inside other objects and must be the last property
 *
 * ---
 *
 * ```ts
 * st.exhaustiveArray(st.string(st.u8()))
 * ```
 *
 * @group Array
 */
export function exhaustiveArray<T>(type: st.Serializer<T>): st.Serializer<T[]> {
    return {
        estimateSize: (value) => {
            if (type.size) {
                return value.length * type.size;
            }

            if (type.estimateSize) {
                return value //
                    .reduce((total, v) => total + type.estimateSize!(v), 0);
            }

            return 0;
        },
        read: (ctx) => {
            let arr: T[] = [];

            while (ctx.offset < ctx.view.byteLength) {
                ctx.pushPath(arr.length - 1);
                arr.push(type.read(ctx));
                ctx.popPath();
            }
            return arr;
        },
        write: (ctx, value) => {
            for (let i = 0; i < value.length; i++) {
                ctx.pushPath(i);
                type.write(ctx, value[i]);
                ctx.popPath();
            }
        },
    };
}

/**
 * @deprecated typo export
 * @hidden
 */
export const exhuastiveArray = exhaustiveArray;
