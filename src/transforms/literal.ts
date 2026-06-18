import { encode } from "./encode";

export function literal<const T>(value: T) {
    return encode<any, T>(
        (v) => {
            if (v !== value) throw new Error(`Invalid literal variant: ${v}`);
            return v;
        },
        (v) => {
            if (v !== value) throw new Error(`Invalid literal variant: ${v}`);
            return v;
        },
    );
}
