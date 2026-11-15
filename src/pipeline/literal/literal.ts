import { st } from "../../index.ts";

/**
 * st.pipe(st.u32("big"), st.literal())
 *
 * @group Pipeline
 */
export function literal<TOut, const T extends TOut>(value: T) {
    return st.encode<T, TOut>({
        encode: (v) => {
            if (v !== value) throw new Error(`Invalid literal variant: ${v}`);
            return v;
        },
        decode: (v) => {
            if (v !== value) throw new Error(`Invalid literal variant: ${v}`);
            return v as T;
        },
    });
}
