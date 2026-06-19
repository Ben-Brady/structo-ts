import { encode } from "./encode";

export function toAscii() {
    return encode<ArrayBuffer, string>({
        encode: (v) =>
            new Uint8Array(Array.from(v).map((char) => validateAscii(char.charCodeAt(0)))).buffer,
        decode: (v) =>
            Array.from(new Uint8Array(v))
                .map((v) => String.fromCharCode(v))
                .join(""),
    });
}

const validateAscii = (v: number): number => {
    if (v >= 0 && v <= 127) return v;
    throw new Error(`Invalid value: ${v}`);
};
