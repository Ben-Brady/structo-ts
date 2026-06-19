import { encode } from "./encode.js";

/**
 * Converts an ArrayBuffer to uppercase hex
 *
 * ```ts
 * st.pipe(
 *     st.bytes(3),
 *     st.toHex()
 * )
 * ```
 *
 * `ArrayBuffer([0, 255, 0])` => `00FF00`
 */
export function toHex() {
    return encode<ArrayBuffer, string>({
        encode: (v) => Uint8Array.fromHex(v).buffer,
        decode: (v) => new Uint8Array(v).toHex().toUpperCase(),
    });
}
