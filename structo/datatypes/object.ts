import { Infer, Serializer } from "../types";

type InferObject<T> =
    T extends Record<string, Serializer<any>> ? { [Key in keyof T]: Infer<T[Key]> } : never;

export function object<T extends Record<string, Serializer<any>>>(
    definition: T,
): Serializer<InferObject<T>> {
    const entries = Object.entries(definition);

    return {
        serialize: (ctx, value) => {
            for (const [key, serializer] of entries) {
                serializer.serialize(ctx, value[key]);
            }
        },
        deserialize: (ctx) => {
            const obj: Record<string, unknown> = {};
            for (const [key, serializer] of entries) {
                obj[key] = serializer.deserialize(ctx);
            }
            return obj as InferObject<T>;
        },
    };
}
