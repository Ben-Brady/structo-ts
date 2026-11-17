import { st } from "../../index.ts";

/**
 * Converts a number into a Date
 *
 * `"precision"` specifies whether to write the seconds or milliseconds
 *
 * - `"milliseconds"`: **(default)** non-lossy when reading/writing the Date type
 * - `"seconds"`: truncates to the second, allowing use of a `st.u32`
 * ---
 *
 * ```ts
 * st.asDate(st.u64())
 * st.asDate(st.u32(), "seconds")
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
    return precision === "milliseconds" //
        ? asDateMilliseconds(type)
        : asDateSeconds(type);
}

function asDateMilliseconds(type: st.Serializer<number>): st.Serializer<Date> {
    return {
        size: type.size,
        estimateSize: !type.estimateSize //
            ? undefined
            : (value) => type.estimateSize!(value.getTime()),
        read: (ctx) => new Date(type.read(ctx)),
        write: (ctx, value) => type.write(ctx, Math.floor(value.getTime())),
    };
}

function asDateSeconds(type: st.Serializer<number>): st.Serializer<Date> {
    return {
        size: type.size,
        estimateSize: !type.estimateSize //
            ? undefined
            : (value) => type.estimateSize!(Math.floor(value.getTime() / 1000)),
        read: (ctx) => new Date(type.read(ctx) * 1000),
        write: (ctx, value) => type.write(ctx, Math.floor(value.getTime() / 1000)),
    };
}
