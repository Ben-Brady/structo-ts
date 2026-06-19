import { encode } from "./encode.js";

export function literal<const T>(value: T) {
    return encode<any, T>({
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
