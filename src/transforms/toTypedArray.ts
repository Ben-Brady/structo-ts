import { encode } from "./encode.js";

type TypedArray = { buffer: ArrayBuffer };
type TypedArrayConstructor<T extends TypedArray> = new (array: ArrayBuffer) => T;

/**
 * Converts an `ArrayBuffer` to a `TypedArray`
 *
 * ```
 * st.pipe(
 *     st.bytes(16),
 *     toTypedArray(Uint8Array),
 * )
 * ```
 */
export function toTypedArray<T extends TypedArray>(arrayType: TypedArrayConstructor<T>) {
    return encode<ArrayBuffer, T>({
        encode: (v) => v.buffer,
        decode: (v) => new arrayType(v),
    });
}
