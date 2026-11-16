import type { Serializer } from "../../types.ts";

/**
 * A sized type that reads as undefined, reading and writing is a noop
 *
 * This is useful for emulating c structs, and when operating on existing formats
 *
 * ---
 * ```ts
 * st.object({
 *     a: st.u32(),
 *     aPadding: st.padding(4),
 *     b: st.u64(),
 * })
 *
 * ```
 * @group Utilities
 */
export function padding(size: number): Serializer<undefined> {
    return {
        size,
        read: (ctx) => {
            ctx.offset += size;
        },
        write: (ctx) => {
            ctx.offset += size;
        },
    };
}
