import type { Serializer } from "../../types.ts";
import type { Pipeline } from "../pipe.ts";

/**
 * Read & write the actual data offset from the current position
 *
 * Generally this should be avoided, but is useful when
 * creating serailizers for existing specifications
 *
 * ---
 *
 * ```ts
 * const Object = st.object({
 *  length: st.u32(),
 *  type: st.u8(),
 *  contents: st.bytes(st.pipe(
 *      st.u32(),
 *      st.offset("relative", -5) // read/write the length to 5 bytes before
 *  ))
 * })
 * ```
 *
 * @param behaviour
 *
 * where to offset from the current position or the start of the ArrayBuffer
 *
 * Note: absolute does not work with the offset specified from `st.read`,
 * it will use the absolute position of the array buffer
 *
 *
 * @param offset The offset to read from, can be negative if using "relative"
 *
 * @group Pipeline
 */
export function offset<T>(
    behaviour: "relative" | "absolute",
    offset: Serializer<number> | number,
): Pipeline<T> {
    return (type) => ({
        size: type.size,
        read: (ctx) => {
            let start = ctx.offset;

            const offsetValue = typeof offset === "number" ? offset : offset.read(ctx);
            ctx.offset = behaviour === "absolute" ? offsetValue : ctx.offset + offsetValue;

            const value = type.read(ctx);
            ctx.offset = start;
            return value;
        },
        write: (ctx, value) => {
            let start = ctx.offset;

            const offsetValue = typeof offset === "number" ? offset : offset.read(ctx);
            ctx.offset = behaviour === "absolute" ? offsetValue : ctx.offset + offsetValue;

            type.write(ctx, value);
            ctx.offset = start;
        },
    });
}
