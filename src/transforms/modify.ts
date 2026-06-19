import type { Transform } from "./pipe";

/**
 * A readonly modification function, useful for sizes or offsets.
 *
 * If you want a writable value, use `st.encode` instead
 *
 *
 * ```ts
 * length: length.save(st.u32())
 * st.sizedBytes(
 *   st.pipe(
 *     length.load(),
 *     st.modify(v => v - 8),
 *   )
 * ))
 *
 * st.pipe()
 * ```
 */
export function modify<TIn, TOut>(callback: (value: TIn) => TOut): Transform<TOut, TIn> {
    return (type) => ({
        size: type.size,
        read: (ctx) => callback(type.read(ctx)),
        write: () => {
            throw new Error("Cannot write an encoded value");
        },
    });
}
