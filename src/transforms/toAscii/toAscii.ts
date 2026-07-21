import { encode } from "../encode/encode.ts";

export function toAscii() {
    return encode<string, Uint8Array>({
        encode: (v) =>
            new Uint8Array(Array.from(v).map((char) => validateAscii(char.charCodeAt(0)))),
        decode: (v) =>
            Array.from(v)
                .map((v) => String.fromCharCode(v))
                .join(""),
    });
}

const validateAscii = (v: number): number => {
    if (v >= 0 && v <= 127) return v;
    throw new Error(`Invalid value: ${v}`);
};
