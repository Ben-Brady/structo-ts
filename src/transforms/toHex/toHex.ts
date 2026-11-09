import { encode } from "../encode/encode.ts";

/**
 * Converts a `Uint8Array` to uppercase hex
 *
 * ---
 *
 * ```ts
 * st.pipe(
 *     st.fixedBytes(3),
 *     st.toHex()
 * )
 * ```
 *
 * `Uint8Array([0, 255, 0])` => `00FF00`
 *
 * @group Pipeline
 */
export function toHex() {
    return encode<string, Uint8Array>({
        encode: (v) => Uint8Array.fromHex(v),
        decode: (v) => v.toHex().toUpperCase(),
    });
}
