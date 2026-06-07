import { Serializer } from "../../types";

export function offset<T>(delta: number, type: Serializer<T>): Serializer<T> {
    return {
        read(ctx) {
            let start = ctx.offset;
            ctx.offset += delta;
            const value = type.read(ctx);
            ctx.offset = start;
            return value;
        },
        write(ctx, value) {
            let start = ctx.offset;
            ctx.offset += delta;
            type.write(ctx, value);
            ctx.offset = start;
        },
    };
}
