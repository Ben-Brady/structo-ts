import type { InferInput, InferOutput, Serializer } from "../../types.ts";

type InferObjectInput<T extends Record<string, Serializer<any>>> = {
    [Key in keyof T]: InferInput<T[Key]>;
};

type InferObjectOutput<T extends Record<string, Serializer<any>>> = {
    [Key in keyof T]: InferOutput<T[Key]>;
};

/**
 * `st.object` is similar to a C struct without any padding, values are stored in the order defined
 *
 * ```ts
 * st.object({
 *     name: st.string(st.u32()),
 *     age: st.u8(),
 *     createdAt: st.f64(),
 * })
 * ```
 */
export function object<T extends Record<string, Serializer<any>>>(
    definition: T,
): Serializer<InferObjectInput<T>, InferObjectOutput<T>> {
    const entires = Object.entries(definition);

    // Use the fact: number + undefined = NaN
    // Check for NaN afterwards
    let computedSize = Object.values(definition).reduce(
        (total, v) => total + (v.size as number),
        0,
    );
    const size = isNaN(computedSize) ? undefined : computedSize;

    return {
        size,
        write: (ctx, value) => {
            if (size) ctx.reserve(size);

            for (let i = 0; i < entires.length; i++) {
                const [key, serializer] = entires[i];

                ctx.pushPath?.(key);
                serializer.write(ctx, value[key]);
                ctx.popPath?.();
            }
        },
        read: (ctx) => {
            const output = {} as InferObjectOutput<T>;

            for (let i = 0; i < entires.length; i++) {
                const [key, serializer] = entires[i];

                ctx.pushPath?.(key);
                //@ts-expect-error
                output[key] = serializer.read(ctx);
                ctx.popPath?.();
            }

            return output;
        },
    };
}
