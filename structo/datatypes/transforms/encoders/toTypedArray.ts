import { encode } from "../encode";

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
    return encode<ArrayBuffer, T>(
        (v) => v.buffer,
        (v) => new arrayType(v),
    );
}
