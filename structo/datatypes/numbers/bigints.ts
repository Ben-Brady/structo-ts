//@ts-ignore TODO
import type { Serializer } from "../../types";

const checkValue = (value: number | bigint, start: bigint, end: bigint) => {
    if (value < start || value >= end) {
        throw new Error("Out of Range");
    }
};

export function u64Bigint(
    endian: "little" | "big" = "little",
): Serializer<number | bigint, bigint> {
    return {
        size: 8,
        write: (ctx, value) => {
            checkValue(value, 0n, 2n ** 64n);

            ctx.alloc(8);
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

export function s64Bigint(
    endian: "little" | "big" = "little",
): Serializer<number | bigint, bigint> {
    return {
        size: 8,
        write: (ctx, value) => {
            checkValue(value, -(2n ** 63n), 2n ** 63n);

            ctx.alloc(8);
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
