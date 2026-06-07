import { Serializer } from "../../types";

const checkValue = (value: number, start: number, end: number) => {
    if (!Number.isInteger(value)) {
        throw new Error("Not Integer");
    }

    if (value < start || value >= end) {
        throw new Error("Out of Range");
    }
};

export function u8(): Serializer<number> {
    return {
        write(ctx, value) {
            checkValue(value, 0, 2 ** 8);

            ctx.requestSpace(1);
            ctx.view.setUint8(ctx.offset, value);
            ctx.offset += 1;
        },
        read(ctx) {
            const value = ctx.view.getUint8(ctx.offset);
            ctx.offset += 1;
            return value;
        },
    };
}

export function u16(endian: "little" | "big" = "little"): Serializer<number> {
    return {
        write(ctx, value) {
            checkValue(value, 0, 2 ** 16);

            ctx.requestSpace(2);
            ctx.view.setUint16(ctx.offset, value, endian === "little");
            ctx.offset += 2;
        },
        read(ctx) {
            const value = ctx.view.getUint16(ctx.offset, endian === "little");
            ctx.offset += 2;
            return value;
        },
    };
}

export function u32(endian: "little" | "big" = "little"): Serializer<number> {
    return {
        write(ctx, value) {
            checkValue(value, 0, 2 ** 32);

            ctx.requestSpace(4);
            ctx.view.setUint32(ctx.offset, value, endian === "little");
            ctx.offset += 4;
        },
        read(ctx) {
            const value = ctx.view.getUint32(ctx.offset, endian === "little");
            ctx.offset += 4;
            return value;
        },
    };
}
