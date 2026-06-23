import type { Serializer } from "../../types.js";

const checkValue = (value: number, start: number, end: number) => {
    if (!Number.isInteger(value)) {
        throw new Error("Not Integer");
    }

    if (value < start || value >= end) {
        throw new Error("Out of Range");
    }
};

/** 8bit signed integer */
export function s8(): Serializer<number> {
    return {
        size: 1,
        write: (ctx, value) => {
            checkValue(value, -(2 ** 7), 2 ** 7);

            ctx.reserve(1);
            ctx.view.setInt8(ctx.offset, value);
            ctx.offset += 1;
        },
        read: (ctx) => {
            const value = ctx.view.getInt8(ctx.offset);
            ctx.offset += 1;
            return value;
        },
    };
}

/** 16bit signed integer */
export function s16(endian: "little" | "big" = "little"): Serializer<number> {
    const littleEndian = endian === "little";
    return {
        size: 2,
        write: (ctx, value) => {
            checkValue(value, -(2 ** 15), 2 ** 15);

            ctx.reserve(2);
            ctx.view.setInt16(ctx.offset, value, littleEndian);
            ctx.offset += 2;
        },
        read: (ctx) => {
            const value = ctx.view.getInt16(ctx.offset, littleEndian);
            ctx.offset += 2;
            return value;
        },
    };
}

/** 32bit signed integer */
export function s32(endian: "little" | "big" = "little"): Serializer<number> {
    const littleEndian = endian === "little";
    return {
        size: 4,
        write: (ctx, value) => {
            checkValue(value, -(2 ** 31), 2 ** 31);

            ctx.reserve(4);
            ctx.view.setInt32(ctx.offset, value, littleEndian);
            ctx.offset += 4;
        },
        read: (ctx) => {
            const value = ctx.view.getInt32(ctx.offset, littleEndian);
            ctx.offset += 4;
            return value;
        },
    };
}

/** 64bit signed integer */
export function s64(endian: "little" | "big" = "little"): Serializer<number> {
    const littleEndian = endian === "little";
    return {
        size: 8,
        write: (ctx, value) => {
            checkValue(value, -(2 ** 63), 2 ** 63);

            ctx.reserve(8);
            ctx.view.setBigInt64(ctx.offset, BigInt(value), littleEndian);
            ctx.offset += 8;
        },
        read: (ctx) => {
            const value = Number(ctx.view.getBigInt64(ctx.offset, littleEndian));
            ctx.offset += 8;
            return value;
        },
    };
}
