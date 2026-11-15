import { st } from "../../index.ts";

type TypedArrayLike = {
    buffer: ArrayBuffer | SharedArrayBuffer;
    byteOffset: number;
    byteLength: number;
    BYTES_PER_ELEMENT: number;
};

type TypedArray<T extends TypedArrayLike> = { BYTES_PER_ELEMENT: number } & (new (
    array: ArrayBuffer | SharedArrayBuffer,
    offset?: number,
    length?: number,
) => T);

/**
 * Converts a `Uint8Array` into the provided a different `TypedArray`, etc Float64Array
 *
 * ---
 *
 * ```ts
 * st.pipe(
 *     st.fixedBytes(4),
 *     toTypedArray(Float32Array)
 * )
 * ```
 *
 * `Uint8Array([164, 112, 157, 63])` => `Float32Array([1.23])`
 *
 * @group Transforms
 */
export function toTypedArray<T extends TypedArrayLike>(
    Array: TypedArray<T>,
): st.Pipeline<T, Uint8Array> {
    return st.encode({
        encode: (arr) =>
            new Uint8Array(
                arr.buffer,
                arr.byteOffset,
                arr.byteLength / Uint8Array.BYTES_PER_ELEMENT,
            ),
        decode: (bytes) => {
            if (bytes.byteLength % Array.BYTES_PER_ELEMENT !== 0) {
                throw new Error(
                    `Provided a ${bytes.byteLength} buffer to a TypedArray that uses ${bytes.BYTES_PER_ELEMENT} bytes per element`,
                );
            }
            return new Array(
                bytes.buffer,
                bytes.byteOffset,
                bytes.byteLength / Array.BYTES_PER_ELEMENT,
            );
        },
    });
}
