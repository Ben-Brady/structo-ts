import { st } from "../../index.ts";

/**
 * Converts a number into a Date
 *
 * ---
 *
 * ```ts
 * st.asDate(st.u64())
 * ```
 *
 * `1784070000` => `Date("7/15/2026")`
 *
 * @group Transforms
 */
export function asDate(type: st.Serializer<number>): st.Serializer<Date> {
    return {
        size: type.size,
        estimateSize: !type.estimateSize //
            ? undefined
            : (value) => type.estimateSize!(value.getTime()),
        read: (ctx) => new Date(type.read(ctx)),
        write: (ctx, value) => type.write(ctx, Math.floor(value.getTime())),
    };
}
