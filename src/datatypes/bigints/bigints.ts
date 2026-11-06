import { assertInRange } from "../../helpers.ts";
import type { Serializer } from "../../types.ts";

/**
 * 64bit unsigned interger
 *
 * This version uses bigints to ensure accuracy is not lost
 */
export function u64Bigint(
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
 * 64bit signed interger
 *
 * This version uses bigints to ensure accuracy is not lost
 */
export function s64Bigint(
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
