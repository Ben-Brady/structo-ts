import type { Serializer, ReaderContext } from "../types.ts";
import { throwSerializationError } from "./utils.ts";

/**
 * Read a schema from an `ArrayBuffer`.
 *
 * You an specify where to read from offset
 *
 * ---
 *
 * ```ts
 * const data: ArrayBuffer = ...;
 * const User = st.object({
 *     name: st.string(st.u8()),
 *     age: st.u32(),
 * })
 *
 * const { name, age } = st.read(User, data)
 * ```
 *
 * @param offset what offset to read the data from
 */
export function read<TIn, TOut>(
    serializer: Serializer<TIn, TOut>,
    buffer: ArrayBuffer | SharedArrayBuffer,
    offset?: number,
): TOut {
    const path: (string | number)[] = [];
    const ctx: ReaderContext = {
        buffer: buffer,
        view: new DataView(buffer),
        bytes: new Uint8Array(buffer),
        offset: offset ?? 0,
        pushPath: (key) => path.push(key),
        popPath: () => path.pop(),
    };

    try {
        return serializer.read(ctx);
    } catch (e) {
        throwSerializationError(e, path);
    }
}
