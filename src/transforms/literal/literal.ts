import { encode } from "../encode/encode.ts";

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
