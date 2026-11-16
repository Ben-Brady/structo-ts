import { st } from "../../index.ts";

/**
 * Converts a `Uint8Array` into a `number[]`
 *
 * ---
 *
 * ```ts
 * st.asBytes(st.fixedBytes(3))
 * ```
 *
 * `Uint8Array([0, 255, 3])` => `[0, 255, 3]`
 *
 * @group Transforms
 */
export function asBytes(type: st.Serializer<Uint8Array>): st.Serializer<number[]> {
    return st.encodeAs(type, {
        encode: (bytes) => {
            bytes.forEach((byte) => {
                if (byte < 0 || byte > 255) throw new Error(`Invalid byte: ${byte}`);
            });
            return new Uint8Array(bytes);
        },
        decode: (v) => Array.from(v),
    });
}
