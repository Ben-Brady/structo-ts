import { Serializer } from "../../types";

const checkValue = (value: number, start: number, end: number) => {
    if (!Number.isInteger(value)) {
        throw new Error("Not Integer");
    }

    if (value < start || value >= end) {
        throw new Error("Out of Range");
    }
};

export function s8(): Serializer<number> {
    return {
        write(ctx, value) {
            checkValue(value, -(2 ** 7), 2 ** 7);

            ctx.requestSpace(1);
            ctx.view.setInt8(ctx.offset, value);
            ctx.offset += 1;
        },
        read(ctx) {
            const value = ctx.view.getInt8(ctx.offset);
            ctx.offset += 1;
            return value;
        },
    };
}

export function s16(endian: "little" | "big" = "little"): Serializer<number> {
    return {
        write(ctx, value) {
            checkValue(value, -(2 ** 15), 2 ** 15);

            ctx.requestSpace(2);
            ctx.view.setInt16(ctx.offset, value, endian === "little");
            ctx.offset += 2;
        },
        read(ctx) {
            const value = ctx.view.getInt16(ctx.offset, endian === "little");
            ctx.offset += 2;
            return value;
        },
    };
}

export function s32(endian: "little" | "big" = "little"): Serializer<number> {
    return {
        write(ctx, value) {
            checkValue(value, -(2 ** 31), 2 ** 31);

            ctx.requestSpace(4);
            ctx.view.setInt32(ctx.offset, value, endian === "little");
            ctx.offset += 4;
        },
        read(ctx) {
            const value = ctx.view.getInt32(ctx.offset, endian === "little");
            ctx.offset += 4;
            return value;
        },
    };
}
