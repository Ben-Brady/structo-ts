import type { Serializer } from "../types";

export function lazy<TIn, TOut = TIn>(type: () => Serializer<TIn, TOut>): Serializer<TIn, TOut> {
    let _size: number | undefined;

    let resolve = () => {
        resolve = () => {};
        const { size, write, read } = type();
        _size = size ?? undefined;
        serializer.read = read;
        serializer.write = write;
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
