import type { Serializer } from "../../types";

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
