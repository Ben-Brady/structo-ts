import { st } from "../../index.ts";

/**
 * `st.exhuastiveArray` does not store it's size, instead reading until the end of the `ArrayBuffer`
 *
 * This means it cannot be nested inside other objects or must be the last property
 *
 * ---
 *
 * ```ts
 * exhuastiveArray(st.string(st.u8()))
 * ```
 *
 * @group Array
 */
export function exhuastiveArray<T>(
    type: st.Serializer<T>,
): st.Serializer<T[]> {
    return {
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
