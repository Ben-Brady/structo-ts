import type { Serializer } from "../../types.ts";

/**
 * `st.lazy` lets you hoist types up by using a clsoure, allowing you to define things in any order
 *
 * This works by resolving the types when they are used for the first time
 *
 * ---
 *
 * ```ts
 * const User = st.object({
 *     id: st.u32(),
 *     position: st.lazy(() => Vec3),
 * })
 *
 * const Vec3 = st.object({
 *     x: st.f32(),
 *     y: st.f32(),
 *     z: st.f32(),
 * })
 * ```
 *
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
