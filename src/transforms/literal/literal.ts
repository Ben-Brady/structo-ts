import { encode } from "../encode/encode.ts";

/**
 * st.pipe(st.u32("big"), st.literal())
 *
 * @group Pipeline
 */
export function literal<const T>(value: T) {
    return encode<T, any>({
        encode: (v) => {
            if (v !== value) throw new Error(`Invalid literal variant: ${v}`);
            return v;
        },
        decode: (v) => {
            if (v !== value) throw new Error(`Invalid literal variant: ${v}`);
            return v;
        },
    });
}
