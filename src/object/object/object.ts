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
 *
 * @group Object
 */
export function object<T extends Record<string, Serializer<any>>>(
    definition: T,
): Serializer<InferObjectInput<T>, InferObjectOutput<T>> {
    const size = computeSize(definition);
    return {
        size,
        write(ctx, value) {
            if (size) ctx.reserve(size);

            for (const key in definition) {
                ctx.pushPath(key);
                definition[key].write(ctx, value[key]);
                ctx.popPath();
            }
        },
        read(ctx) {
            const output: Record<string, any> = {};

            for (const key in definition) {
                ctx.pushPath(key);
                output[key] = definition[key].read(ctx);
                ctx.popPath();
            }

            return output as InferObjectOutput<T>;
        },
    };
}

function computeSize(definition: Record<string, Serializer<any>>): number | undefined {
    let total = 0;
    for (const serializer of Object.values(definition)) {
        if (!serializer.size) return undefined;
        total += serializer.size;
    }

    return total;
}
