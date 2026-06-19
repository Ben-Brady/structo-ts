import type { Serializer } from "../types";

export function lazy<TIn, TOut = TIn>(type: () => Serializer<TIn, TOut>): Serializer<TIn, TOut> {
    let _size: number | undefined;

    let resolve = () => {
        const t = type();
        _size = t.size ?? undefined;
        serializer.read = t.read;
        serializer.write = t.write;
        resolve = () => {};
    };

    const serializer: Serializer<TIn, TOut> = {
        get size() {
            resolve();
            return _size;
        },
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
