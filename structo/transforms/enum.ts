import { encode } from "./encode";

export function enum_<const T>(values: T[]) {
    return encode<any, T>(
        (v) => {
            if (!values.includes(v)) throw new Error(`Invalid enum variant: ${v}`);
            return v;
        },
        (v) => {
            if (!values.includes(v)) throw new Error(`Invalid enum variant: ${v}`);
            return v;
        },
    );
}

export { enum_ as enum };
