import type { Serializer } from "../../types.ts";

/**
 * @group Utilities
 */
export function lazy<TIn, TOut = TIn>(type: () => Serializer<TIn, TOut>): Serializer<TIn, TOut> {
    // This inheriently has to be hacky to work with the API defined
    let resolve = () => {
        resolve = () => {};
        const { size, write, read } = type();
        Object.defineProperties(serializer, {
            size: { get: () => size },
            read: { value: read },
            write: { value: write },
        });
    };

    const serializer: Serializer<TIn, TOut> = {
        get size() {
            resolve();
            return this.size;
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
