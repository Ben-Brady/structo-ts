import type { Serializer } from "../../types";

export function positionOffset<T>(delta: number) {
    return (type: Serializer<T>): Serializer<T> => ({
        size: type.size,
        read: (ctx) => {
            let start = ctx.offset;
            ctx.offset += delta;
            const value = type.read(ctx);
            ctx.offset = start;
            return value;
        },
        write: (ctx, value) => {
            let start = ctx.offset;
            ctx.offset += delta;
            type.write(ctx, value);
            ctx.offset = start;
        },
    });
}
