import { pipe, fixedBytes, encode } from "../../import.ts";

/**
 * `st.fixedString` stores a fixed length string, note the length denotes byte length not 
 *
 * ---
 * ```ts
 * const User = st.object({
 *     id: st.fixedString(8)
 * })
 * ```
 *
 * @group String / Bytes
 */
export function stringFixed(size: number) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    return pipe(
        fixedBytes(size),
        encode({
            decode: (value) => decoder.decode(value),
            encode: (value) => {
                if (typeof value !== "string") throw new Error("Expected String");
                return encoder.encode(value);
            },
        }),
    );
}
