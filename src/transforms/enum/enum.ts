import { encode } from "../encode/encode.ts";

export function enum_<const T>(values: T[]) {
    // Note: We have to use any here instead of T
    // because when T = 0 | 1 | 2, then T != number
    // so we use any as an excape hatch :torment:
    return encode<T, any>({
        encode: (v) => {
            if (!values.includes(v)) throw new Error(`Invalid enum variant: ${v}`);
            return v;
        },
        decode: (v) => {
            if (!values.includes(v)) throw new Error(`Invalid enum variant: ${v}`);
            return v;
        },
    });
}

export { enum_ as enum };
