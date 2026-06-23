import type { Serializer } from "../../types.js";

/** 16bit float */
export function f16(endian: "little" | "big" = "little"): Serializer<number> {
    const littleEndian = endian === "little";
    return {
        size: 2,
        write: (ctx, value) => {
            ctx.reserve(2);
            ctx.view.setFloat16(ctx.offset, value, littleEndian);
            ctx.offset += 2;
        },
        read: (ctx) => {
            const value = ctx.view.getFloat16(ctx.offset, littleEndian);
            ctx.offset += 2;
            return value;
        },
    };
}
/** 32bit float */
export function f32(endian: "little" | "big" = "little"): Serializer<number> {
    const littleEndian = endian === "little";
    return {
        size: 4,
        write: (ctx, value) => {
            ctx.reserve(4);
            ctx.view.setFloat32(ctx.offset, value, littleEndian);
            ctx.offset += 4;
        },
        read: (ctx) => {
            const value = ctx.view.getFloat32(ctx.offset, littleEndian);
            ctx.offset += 4;
            return value;
        },
    };
}

/** 64bit float */
export function f64(endian: "little" | "big" = "little"): Serializer<number> {
    const littleEndian = endian === "little";
    return {
        size: 8,
        write: (ctx, value) => {
            ctx.reserve(8);
            ctx.view.setFloat64(ctx.offset, value, littleEndian);
            ctx.offset += 8;
        },
        read: (ctx) => {
            const value = ctx.view.getFloat64(ctx.offset, littleEndian);
            ctx.offset += 8;
            return value;
        },
    };
}
