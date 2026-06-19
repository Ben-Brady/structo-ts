import * as st from "../../index.js";

/**
 * exhuastiveArray is read until the end of the data
 *
 * ```py
 * exhuastiveArray(st.string(st.u8()))
 * ```
 */
export function exhuastiveArray<T>(type: st.Serializer<T>): st.Serializer<T[]> {
    return {
        read(ctx) {
            let arr: T[] = [];

            let i = 0;
            while (ctx.offset < ctx.view.byteLength) {
                const TRACK_STACK = i++ < 4096;

                if (TRACK_STACK) ctx.stack.push(`[${arr.length - 1}]`);
                arr.push(type.read(ctx));
                if (TRACK_STACK) ctx.stack.pop();
            }
            return arr;
        },
        write(ctx, value) {
            const TRACK_STACK = value.length < 4096;

            for (let i = 0; i < value.length; i++) {
                if (TRACK_STACK) ctx.stack.push(`[${i}]`);
                type.write(ctx, value[i]);
                if (TRACK_STACK) ctx.stack.pop();
            }
        },
    };
}
