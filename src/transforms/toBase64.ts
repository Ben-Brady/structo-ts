import { encode } from "./encode.js";

export function toBase64() {
    return encode<Uint8Array, string>({
        encode: (v) => Uint8Array.fromBase64(v),
        decode: (v) => v.toBase64(),
    });
}
