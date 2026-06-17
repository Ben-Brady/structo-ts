import { encode } from "../encode";

export function toBase64() {
    return encode<ArrayBuffer, string>(
        (v) => Uint8Array.fromBase64(v).buffer,
        (v) => new Uint8Array(v).toBase64(),
    );
}
