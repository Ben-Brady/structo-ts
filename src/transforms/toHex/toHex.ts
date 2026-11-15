import { st } from "../../index.ts";

/**
 * Converts a `Uint8Array` to uppercase hex
 *
 * ---
 *
 * ```ts
 * st.pipe(st.fixedBytes(3), st.toHex())
 * ```
 *
 * `Uint8Array([0, 255, 0])` => `00FF00`
 *
 * @group Transforms
 */
export function toHex(): st.Pipeline<string, Uint8Array> {
    return (type) => ({
        size: type.size,
        read: (ctx) => type.read(ctx).toHex().toUpperCase(),
        write: (ctx, value) => type.write(ctx, Uint8Array.fromHex(value)),
    });
}
