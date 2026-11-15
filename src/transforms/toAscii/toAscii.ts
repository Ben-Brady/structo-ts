import { st } from "../../index.ts";

/**
 * Converts a `Uint8Array` to ascii text
 *
 * ---
 *
 * ```ts
 * st.pipe(st.fixedBytes(3), st.toAscii())
 * ```
 *
 * `Uint8Array([65, 99, 101])` => `Ace`
 *
 * @group Transforms
 */
export function toAscii(): st.Pipeline<string, Uint8Array> {
    return st.encode({
        encode: (v) => {
            const bytes = Array.from(v).map((char) => char.charCodeAt(0));
            bytes.forEach((byte) => {
                if (byte > 127) throw new Error(`Invalid ascii byte: ${byte}`);
            });
            return new Uint8Array(bytes);
        },
        decode: (v) =>
            Array.from(v)
                .map((v) => String.fromCharCode(v))
                .join(""),
    });
}
