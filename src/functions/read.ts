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
 *
 * @param offset what offset to read the data from
 *
 * @throws {Error} If serialization fails, throws an error with a path to what caused the error
 *
 * @group Functions
 */
export function read<T>(
    serializer: Serializer<T>,
    buffer: ArrayBuffer | SharedArrayBuffer,
    offset?: number,
): T {
    offset ??= 0;
    const path: (string | number)[] = [];
    const ctx: ReaderContext = {
        offset,
        buffer,
        view: new DataView(buffer),
        bytes: new Uint8Array(buffer),
        pushPath: (key) => path.push(key),
        popPath: () => path.pop(),
    };

    try {
        return serializer.read(ctx);
    } catch (e) {
        throwSerializationError(e, path);
    }
}

/**
 * Created a ReaderContext for use with `Serializer.read`
 *
 * ---
 *
 * ```ts
 * const ctx = createReaderContext(buffer)
 * const users = []
 * while (ctx.offset < buffer.byteLength) {
 *     users.push(User.read(ctx))
 * }
 * ```
 *
 * @param offset what offset to read the data from
 *
 * @returns {ReaderContext} a newly created reader context without error reporting
 *
 * @group Functions
 */
export function createReaderContext(
    buffer: ArrayBuffer | SharedArrayBuffer,
    offset?: number,
): ReaderContext {
    return {
        buffer: buffer,
        view: new DataView(buffer),
        bytes: new Uint8Array(buffer),
        offset: offset ?? 0,
        pushPath: Function.prototype as () => void,
        popPath: Function.prototype as () => void,
    };
}
