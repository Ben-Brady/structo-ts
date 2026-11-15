import { st } from "../../index.ts";

/**
 * Converts a `Uint8Array` to uppercase hex
 *
 * ---
 *
 * ```ts
 * st.asHex(st.fixedBytes(3))
 * ```
 *
 * `Uint8Array([0, 255, 0])` => `00FF00`
 *
 * @group Transforms
 */
export function asHex(type: st.Serializer<Uint8Array>): st.Serializer<string> {
    return {
        size: type.size,
        read: (ctx) => type.read(ctx).toHex().toUpperCase(),
        write: (ctx, value) => type.write(ctx, Uint8Array.fromHex(value)),
    };
}
