import type { ReaderContext } from "../types.ts";

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
        pushPath: () => {},
        popPath: () => {},
    };
}
