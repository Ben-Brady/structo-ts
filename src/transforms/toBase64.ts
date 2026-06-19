import { encode } from "./encode.js";

export function toBase64() {
    return encode<ArrayBuffer, string>({
        encode: (v) => Uint8Array.fromBase64(v).buffer,
        decode: (v) => new Uint8Array(v).toBase64(),
    });
}
