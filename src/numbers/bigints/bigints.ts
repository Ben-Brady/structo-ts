import { assertInRange } from "../../helpers.ts";
import type { Serializer } from "../../types.ts";

/**
 * 64bit unsigned interger, read into a bigints
 *
 * Little endian by default
 *
 * ---
 *
 * ```ts
 * const Id = st.u64BigInt()
 * const Size = st.u64BigInt("big")
 * ```
 *
 * @group Number
 */
export function u64BigInt(
    endian: "little" | "big" = "little",
): Serializer<number | bigint, bigint> {
    return {
        size: 8,
        write: (ctx, value) => {
            assertInRange(value, 0n, 2n ** 64n);

            ctx.reserve(8);
            ctx.view.setBigUint64(ctx.offset, BigInt(value), endian === "little");
            ctx.offset += 8;
        },
        read: (ctx) => {
            const value = ctx.view.getBigUint64(ctx.offset, endian === "little");
            ctx.offset += 8;
            return value;
        },
    };
}
/**
 * 64bit signed interger, read into a bigints
 *
 * Little endian by default
 *
 * ---
 *
 * ```ts
 * const Id = st.s64BigInt()
 * const Size = st.s64BigInt("big")
 * ```
 *
 * @group Number
 */
export function s64BigInt(
    endian: "little" | "big" = "little",
): Serializer<number | bigint, bigint> {
    return {
        size: 8,
        write: (ctx, value) => {
            assertInRange(value, -(2n ** 63n), 2n ** 63n);

            ctx.reserve(8);
            ctx.view.setBigInt64(ctx.offset, BigInt(value), endian === "little");
            ctx.offset += 8;
        },
        read: (ctx) => {
            const value = ctx.view.getBigInt64(ctx.offset, endian === "little");
            ctx.offset += 8;
            return value;
        },
    };
}
