import type { st } from "../../index.ts";

/**
 * A readonly modification function, useful for sizes or offsets.
 * This is mainly intended for handling reading of existing data formats
 * such as RIFF, try not to use this for purpose made formats.
 *
 * If you want a writable value, use `st.encode` instead
 *
 *
 * ```ts
 * length: length.save(st.u32())
 * const HEADER_OFFSET = 8
 * const HeaderSize = st.pipe(
 *     st.u32()
 *     st.modify(v => v + HEADER_SIZE),
 * )
 * const Header = st.bytes(HeaderSize)
 * ```
 *
 * @group Pipeline
 */
export function modify<T>(callback: (value: T) => T): st.Pipeline<T> {
    return (type) => ({
        size: type.size,
        read: (ctx) => callback(type.read(ctx)),
        write: () => {
            throw new Error("Cannot write an encoded value");
        },
    });
}
