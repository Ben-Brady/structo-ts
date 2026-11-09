import { assertInRange, assertInteger } from "../../helpers.ts";
import type { Serializer } from "../../types.ts";

/**
 * 8 bit unsigned integer
 *
 * @group Number
 */
export function u8(): Serializer<number> {
    return {
        size: 1,
        write: (ctx, value) => {
            assertInteger(value);
            assertInRange(value, 0, 2 ** 8);

            ctx.reserve(1);
            ctx.view.setUint8(ctx.offset, value);
            ctx.offset += 1;
        },
        read: (ctx) => {
            const value = ctx.view.getUint8(ctx.offset);
            ctx.offset += 1;
            return value;
        },
    };
}

/**
 * 16 bit unsigned integer
 *
 * little endian by default
 *
 * @group Number
 */
export function u16(endian: "little" | "big" = "little"): Serializer<number> {
    const littleEndian = endian === "little";
    return {
        size: 2,
        write: (ctx, value) => {
            assertInteger(value);
            assertInRange(value, 0, 2 ** 16);

            ctx.reserve(2);
            ctx.view.setUint16(ctx.offset, value, littleEndian);
            ctx.offset += 2;
        },
        read: (ctx) => {
            const value = ctx.view.getUint16(ctx.offset, littleEndian);
            ctx.offset += 2;
            return value;
        },
    };
}

/**
 * 32 bit unsigned integer
 *
 * little endian by default
 *
 * @group Number
 */
export function u32(endian: "little" | "big" = "little"): Serializer<number> {
    const littleEndian = endian === "little";
    return {
        size: 4,
        write: (ctx, value) => {
            assertInteger(value);
            assertInRange(value, 0, 2 ** 32);

            ctx.reserve(4);
            ctx.view.setUint32(ctx.offset, value, littleEndian);
            ctx.offset += 4;
        },
        read: (ctx) => {
            const value = ctx.view.getUint32(ctx.offset, littleEndian);
            ctx.offset += 4;
            return value;
        },
    };
}

/**
 * 64 bit unsigned integer
 *
 * little endian by default
 *
 * @group Number
 */
export function u64(endian: "little" | "big" = "little"): Serializer<number> {
    const littleEndian = endian === "little";
    return {
        size: 8,
        write: (ctx, value) => {
            assertInteger(value);
            assertInRange(value, 0, 2 ** 64);

            ctx.reserve(8);
            ctx.view.setBigUint64(ctx.offset, BigInt(value), littleEndian);
            ctx.offset += 8;
        },
        read: (ctx) => {
            const value = Number(ctx.view.getBigUint64(ctx.offset, littleEndian));
            ctx.offset += 8;
            return value;
        },
    };
}
