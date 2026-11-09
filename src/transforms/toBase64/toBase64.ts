import { encode } from "../encode/encode.ts";

/**
 * Converts a `Uint8Array` to base64
 *
 * ```ts
 * st.pipe(
 *     st.fixedBytes(3),
 *     st.toBase64()
 * )
 * ```
 *
 * @group Pipeline
 */
export function toBase64() {
    return encode<string, Uint8Array>({
        encode: (v) => Uint8Array.fromBase64(v),
        decode: (v) => v.toBase64(),
    });
}
