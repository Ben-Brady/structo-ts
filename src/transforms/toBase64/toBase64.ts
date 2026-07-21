import { encode } from "../encode/encode.ts";

export function toBase64() {
    return encode<string, Uint8Array>({
        encode: (v) => Uint8Array.fromBase64(v),
        decode: (v) => v.toBase64(),
    });
}
