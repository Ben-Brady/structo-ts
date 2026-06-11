import { Serializer } from "../../types";

export function f32(): Serializer<number> {
    return {
        write(ctx, value) {
            ctx.requestSpace(4);
            ctx.view.setFloat32(ctx.offset, value);
            ctx.offset += 4;
        },
        read(ctx) {
            const value = ctx.view.getFloat32(ctx.offset);
            ctx.offset += 4;
            return value;
        },
    };
}

export function f64(): Serializer<number> {
    return {
        write(ctx, value) {
            ctx.requestSpace(8);
            ctx.view.setFloat64(ctx.offset, value);
            ctx.offset += 8;
        },
        read(ctx) {
            const value = ctx.view.getFloat64(ctx.offset);
            ctx.offset += 8;
            return value;
        },
    };
}
