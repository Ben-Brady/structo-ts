import type { Serializer } from "../types";

export function lazy<TIn, TOut>(type: () => Serializer<TIn, TOut>): Serializer<TIn, TOut> {
    const resolve = () => {
        const t = type();
        serializer.size = t.size ?? undefined;
        serializer.read = t.read;
        serializer.write = t.write;
    };

    const serializer: Serializer<TIn, TOut> = {
        size: undefined,
        read(ctx) {
            resolve();
            return this.read(ctx);
        },
        write(ctx, value) {
            resolve();
            return this.write(ctx, value);
        },
    };
    return serializer;
}
