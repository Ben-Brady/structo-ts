import { encode } from "../encode/encode.ts";

/**
 * Converts a `Uint8Array` into a `number[]`
 *
 * ---
 *
 * ```ts
 * st.pipe(
 *     st.fixedBytes(3),
 *     st.toBytes()
 * )
 * ```
 *
 * `ArrayBuffer([0, 255, 3])` => `[0, 255, 3]`
 *
 * @group Pipeline
 */
export function toBytes() {
    return encode<number[], Uint8Array>({
        encode: (v) => new Uint8Array(v.map(validateByte)),
        decode: (v) => Array.from(v),
    });
}

const validateByte = (v: number): number => {
    if (v >= 0 && v <= 255) return v;
    throw new Error(`Invalid value: ${v}`);
};
