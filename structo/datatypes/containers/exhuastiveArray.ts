import * as st from "../..";

/**
 * exhuastiveArray is read until the end of the data
 *
 * ```py
 * exhuastiveArray(st.u32())
 * ```
 */
export function exhuastiveArray<T>(type: st.Serializer<T>): st.Serializer<T[]> {
    return {
        read(ctx) {
            const endPoint = ctx.offset + ctx.view.byteLength;

            let arr: T[] = [];
            while (ctx.offset < endPoint) {
                arr.push(type.read(ctx));
            }
            return arr;
        },
        write(ctx, value) {
            for (let i = 0; i < value.length; i++) {
                type.write(ctx, value[i]);
            }
        },
    };
}
