import { st } from "../../index.ts";

/**
 * Converts a number into a Date
 *
 * ---
 *
 * ```ts
 * st.asDate(st.u32())
 * ```
 *
 * `1784070000` => `Date("7/15/2026")`
 *
 * @group Transforms
 */
export function asDate(
    type: st.Serializer<number>,
    precision: "seconds" | "milliseconds" = "milliseconds",
): st.Serializer<Date> {
    if (precision === "milliseconds") {
        return {
            size: type.size,
            read: (ctx) => new Date(type.read(ctx)),
            write: (ctx, value) => type.write(ctx, Math.floor(value.getTime())),
        };
    } else {
        return {
            size: type.size,
            read: (ctx) => new Date(type.read(ctx) * 1000),
            write: (ctx, value) => type.write(ctx, Math.floor(value.getTime() / 1000)),
        };
    }
}
