import type { Serializer } from "../../types";

/**
 * `st.json` stores JSON data using a string serializer
 *
 * ```
 * st.json(st.string(st.u32()))
 * ```
 *
 */
export function json(type: Serializer<string>): Serializer<any> {
    return {
        size: type.size,
        write: (ctx, value) => {
            const json = JSON.stringify(value);
            type.write(ctx, json);
        },
        read: (ctx) => {
            const value = type.read(ctx);
            return JSON.parse(value);
        },
    };
}
