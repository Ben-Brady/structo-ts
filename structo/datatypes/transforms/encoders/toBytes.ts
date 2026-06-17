import { encode } from "../encode";

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
    return encode<ArrayBuffer, number[]>(
        (v) => new Uint8Array(v.map(validateByte)).buffer,
        (v) => Array.from(new Uint8Array(v)),
    );
}

const validateByte = (v: number): number => {
    if (v >= 0 && v <= 255) return v;
    throw new Error(`Invalid value: ${v}`);
};
