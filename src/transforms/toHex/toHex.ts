import { encode } from "../encode/encode.ts";

/**
 * Converts an Uint8Array to uppercase hex
 *
 * ```ts
 * st.pipe(
 *     st.bytes(3),
 *     st.toHex()
 * )
 * ```
 *
 * `Uint8Array([0, 255, 0])` => `00FF00`
 */
export function toHex() {
    return encode<string, Uint8Array>({
        encode: (v) => Uint8Array.fromHex(v),
        decode: (v) => v.toHex().toUpperCase(),
    });
}
