import type { Serializer } from "../types";

/**
 * Whilst reading this type, don't advance the offset after reading
 *
 * This can be useful for taggedUnions where they key is the first value in all the variants
 *
 * ```
 * st.object({
 *     stringLength: st.pipe(
 *         st.u16(),
 *         st.noAdvance(),
 *     ),
 *     text: st.string(st.u16()),
 * })
 */
export function noAdvance<T>() {
    return (type: Serializer<T>): Serializer<T> => ({
        size: type.size,
        read: (ctx) => {
            let start = ctx.offset;
            const value = type.read(ctx);
            ctx.offset = start;
            return value;
        },
        write: (ctx, value) => {
            let start = ctx.offset;
            type.write(ctx, value);
            ctx.offset = start;
        },
    });
}
