import type { Serializer } from "../../types";


/** 8bit unsigned integer */
export function u8(): Serializer<number> {
    return {
        size: 1,
        write: (ctx, value) => {
            if (!Number.isInteger(value)) throw new Error("Not Integer");
            if (value < 0 || value >= 2 ** 8) throw new Error("Out of Range");

            ctx.alloc(1);
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

/** 16bit unsigned integer */
export function u16(endian: "little" | "big" = "little"): Serializer<number> {
    return {
        size: 2,
        write: (ctx, value) => {
            if (!Number.isInteger(value)) throw new Error("Not Integer");
            if (value < 0 || value >= 2 ** 16) throw new Error("Out of Range");

            ctx.alloc(2);
            ctx.view.setUint16(ctx.offset, value, endian === "little");
            ctx.offset += 2;
        },
        read: (ctx) => {
            const value = ctx.view.getUint16(ctx.offset, endian === "little");
            ctx.offset += 2;
            return value;
        },
    };
}

/** 32bit unsigned integer */
export function u32(endian: "little" | "big" = "little"): Serializer<number> {
    return {
        size: 4,
        write: (ctx, value) => {
            if (!Number.isInteger(value)) throw new Error("Not Integer");
            if (value < 0 || value >= 2 ** 32) throw new Error("Out of Range");

            ctx.alloc(4);
            ctx.view.setUint32(ctx.offset, value, endian === "little");
            ctx.offset += 4;
        },
        read: (ctx) => {
            const value = ctx.view.getUint32(ctx.offset, endian === "little");
            ctx.offset += 4;
            return value;
        },
    };
}

/** 64bit unsigned integer */
export function u64(endian: "little" | "big" = "little"): Serializer<number> {
    return {
        size: 8,
        write: (ctx, value) => {
            if (!Number.isInteger(value)) throw new Error("Not Integer");
            if (value < 0 || value >= 2 ** 64) throw new Error("Out of Range");

            ctx.alloc(8);
            ctx.view.setBigUint64(ctx.offset, BigInt(value), endian === "little");
            ctx.offset += 8;
        },
        read: (ctx) => {
            const value = Number(ctx.view.getBigUint64(ctx.offset, endian === "little"));
            ctx.offset += 8;
            return value;
        },
    };
}
