import { encode } from "../encode/encode.ts";

/**
 * Converts a `Uint8Array` to ascii text
 *
 * ---
 *
 * ```ts
 * st.pipe(
 *     st.fixedBytes(3),
 *     st.toAscii()
 * )
 * ```
 *
 * `Uint8Array([65, 99, 101])` => `Ace`
 *
 * @group Pipeline
 */
export function toAscii() {
    return encode<string, Uint8Array>({
        encode: (v) => {
            const bytes = Array.from(v) //
                .map((char) => {
                    const byte = char.charCodeAt(0);
                    if (byte > 127) throw new Error(`Invalid ascii byte: ${byte}`);
                    return byte;
                });
            return new Uint8Array(bytes);
        },
        decode: (v) =>
            Array.from(v)
                .map((v) => String.fromCharCode(v))
                .join(""),
    });
}
