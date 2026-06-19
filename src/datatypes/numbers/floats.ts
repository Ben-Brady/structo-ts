import type { Serializer } from "../../types.js";

/** 16bit float */
export function f16(endian: "little" | "big" = "little"): Serializer<number> {
    return {
        size: 2,
        write: (ctx, value) => {
            ctx.alloc(2);
            ctx.view.setFloat16(ctx.offset, value, endian === "little");
            ctx.offset += 2;
        },
        read: (ctx) => {
            const value = ctx.view.getFloat16(ctx.offset, endian === "little");
            ctx.offset += 2;
            return value;
        },
    };
}
/** 32bit float */
export function f32(endian: "little" | "big" = "little"): Serializer<number> {
    return {
        size: 4,
        write: (ctx, value) => {
            ctx.alloc(4);
            ctx.view.setFloat32(ctx.offset, value, endian === "little");
            ctx.offset += 4;
        },
        read: (ctx) => {
            const value = ctx.view.getFloat32(ctx.offset, endian === "little");
            ctx.offset += 4;
            return value;
        },
    };
}

/** 64bit float */
export function f64(endian: "little" | "big" = "little"): Serializer<number> {
    return {
        size: 8,
        write: (ctx, value) => {
            ctx.alloc(8);
            ctx.view.setFloat64(ctx.offset, value, endian === "little");
            ctx.offset += 8;
        },
        read: (ctx) => {
            const value = ctx.view.getFloat64(ctx.offset, endian === "little");
            ctx.offset += 8;
            return value;
        },
    };
}
