import { st } from "../../index.ts";

/**
 * Converts a `Uint8Array` to base64
 *
 * ---
 *
 * ```ts
 * st.asBase64(st.fixedBytes(3))
 * ```
 *
 * `Uint8Array([0, 255, 0])` => `AP8A`
 *
 * @group Transforms
 */
export function asBase64(type: st.Serializer<Uint8Array>): st.Serializer<string> {
    return st.encode(type, {
        encode: (v: string) => Uint8Array.fromBase64(v),
        decode: (v: Uint8Array) => v.toBase64(),
    });
}
