import { st } from "../../index.ts";

type InferObject<T extends Record<string, st.Serializer<any>>> = {
    [Key in keyof T]: st.Infer<T[Key]>;
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
export function object<T extends Record<string, st.Serializer<any>>>(
    definition: T,
): st.Serializer<InferObject<T>> {
    return {
        size: computeSize(definition),
        estimateSize: (value) => {
            let total = 0;
            for (const key in definition) {
                const serializer = definition[key];
                total += serializer.size ?? serializer.estimateSize?.(value[key]) ?? 0;
            }
            return total;
        },
        write: (ctx, value) => {
            for (const key in definition) {
                ctx.pushPath(key);
                definition[key].write(ctx, value[key]);
                ctx.popPath();
            }
        },
        read: (ctx) => {
            const output: Record<string, any> = {};

            for (const key in definition) {
                ctx.pushPath(key);
                output[key] = definition[key].read(ctx);
                ctx.popPath();
            }

            return output as InferObject<T>;
        },
    };
}

function computeSize(definition: Record<string, st.Serializer<any>>): number | undefined {
    let total = 0;
    for (const serializer of Object.values(definition)) {
        if (serializer.size === undefined) return undefined;
        total += serializer.size;
    }

    return total;
}
