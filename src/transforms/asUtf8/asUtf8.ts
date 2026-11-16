import { st } from "../../index.ts";

/**
 * Converts a `Uint8Array` to UTF-8
 *
 * ---
 *
 * ```ts
 * st.asUtf8(st.fixedBytes(3))
 * ```
 *
 * `Uint8Array([65, 99, 101])` => `Ace`
 *
 * @group Transforms
 */
export function asUtf8(type: st.Serializer<Uint8Array>): st.Serializer<string> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    return st.encodeAs(type, {
        encode: (v) => {
            if (typeof v !== "string") throw new Error("Expected string type");
            return encoder.encode(v);
        },
        decode: (v) => decoder.decode(v),
    });
}
