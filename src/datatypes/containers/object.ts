import type { InferInput, InferOutput, Serializer } from "../../types";

type InferObjectInfer<T> =
    T extends Record<string, Serializer<any>> ? { [Key in keyof T]: InferInput<T[Key]> } : never;

type InferObjectOutput<T> =
    T extends Record<string, Serializer<any>> ? { [Key in keyof T]: InferOutput<T[Key]> } : never;

/**
 * `object` is equivelent to a C struct, values are stored in the order defined
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
): Serializer<InferObjectInfer<T>, InferObjectOutput<T>> {
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
            if (size) ctx.alloc(size);

            for (let i = 0; i < entires.length; i++) {
                const [key, serializer] = entires[i];

                ctx.stack.push(`.${key}`);
                serializer.write(ctx, value[key]);
                ctx.stack.pop();
            }
        },
        read: (ctx) => {
            const output: [string, unknown][] = new Array(entires.length);
            for (let i = 0; i < entires.length; i++) {
                const [key, serializer] = entires[i];

                ctx.stack.push(`.${key}`);
                output[i] = [key, serializer.read(ctx)];
                ctx.stack.pop();
            }

            return Object.fromEntries(output) as InferObjectOutput<T>;
        },
    };
}
