import { encode } from "../encode";

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
    return encode<ArrayBuffer, string>(
        (v) => Uint8Array.fromHex(v).buffer,
        (v) => new Uint8Array(v).toHex().toUpperCase(),
    );
}
