import { st } from "../../index.ts";

/**
 * Converts a `Uint8Array` into a `number[]`
 *
 * ---
 *
 * ```ts
 * st.pipe(st.fixedBytes(3), st.toBytes())
 * ```
 *
 * `ArrayBuffer([0, 255, 3])` => `[0, 255, 3]`
 *
 * @group Transforms
 */
export function toBytes(): st.Pipeline<number[], Uint8Array> {
    return st.encode<number[], Uint8Array>({
        encode: (bytes) => {
            bytes.forEach((byte) => {
                if (byte < 0 || byte > 255) throw new Error(`Invalid byte: ${byte}`);
            });
            return new Uint8Array(bytes);
        },
        decode: (v) => Array.from(v),
    });
}
