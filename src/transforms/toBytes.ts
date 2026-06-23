import { encode } from "./encode.js";

/**
 * Converts an ArrayBuffer to the byte digits
 *
 * ```ts
 * st.pipe(
 *     st.bytes(3),
 *     st.toBytes()
 * )
 * ```
 *
 * `ArrayBuffer([0, 255, c])` => `[0, 255, ArrayBuffer([0, 255, 0])]`
 */
export function toBytes() {
    return encode<Uint8Array, number[]>({
        encode: (v) => new Uint8Array(v.map(validateByte)),
        decode: (v) => Array.from(v),
    });
}

const validateByte = (v: number): number => {
    if (v >= 0 && v <= 255) return v;
    throw new Error(`Invalid value: ${v}`);
};
