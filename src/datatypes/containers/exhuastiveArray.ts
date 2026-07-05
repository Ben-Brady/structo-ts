import * as st from "../../index.js";

/**
 * exhuastiveArray is read until the end of the data
 *
 * ```py
 * exhuastiveArray(st.string(st.u8()))
 * ```
 */
export function exhuastiveArray<TIn, TOut>(type: st.Serializer<TIn, Tout>): st.Serializer<TIn[], TOut[]> {
    return {
        read(ctx) {
            let arr: TOut[] = [];

            while (ctx.offset < ctx.view.byteLength) {
                ctx.pushPath?.(arr.length - 1);
                arr.push(type.read(ctx));
                ctx.popPath?.();
            }
            return arr;
        },
        write(ctx, value) {
            for (let i = 0; i < value.length; i++) {
                ctx.pushPath?.(i);
                type.write(ctx, value[i]);
                ctx.popPath?.();
            }
        },
    };
}
