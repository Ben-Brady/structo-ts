import type { Serializer } from "../types.js";

export function offset<TIn, TOut>(
    behaviour: "relative" | "absolute",
    offset: Serializer<number> | number,
) {
    return (type: Serializer<TIn, TOut>): Serializer<TIn, TOut> => ({
        size: type.size,
        read: (ctx) => {
            let start = ctx.offset;

            const offsetValue = typeof offset === "number" ? offset : offset.read(ctx);
            ctx.offset = behaviour === "absolute" ? offsetValue : ctx.offset + offsetValue;

            const value = type.read(ctx);
            ctx.offset = start;
            return value;
        },
        write: (ctx, value) => {
            let start = ctx.offset;

            const offsetValue = typeof offset === "number" ? offset : offset.read(ctx);
            ctx.offset = behaviour === "absolute" ? offsetValue : ctx.offset + offsetValue;

            type.write(ctx, value);
            ctx.offset = start;
        },
    });
}
