import { Infer, Serializer } from "../../types";

type InferObject<T> =
    T extends Record<string, Serializer<any>> ? { [Key in keyof T]: Infer<T[Key]> } : never;

export function object<T extends Record<string, Serializer<any>>>(
    definition: T,
): Serializer<InferObject<T>> {
    const entries = Object.entries(definition);

    return {
        write(ctx, value) {
            for (const [key, serializer] of entries) {
                serializer.write(ctx, value[key]);
            }
        },
        read(ctx) {
            const obj: Record<string, unknown> = {};
            for (const [key, serializer] of entries) {
                obj[key] = serializer.read(ctx);
            }
            return obj as InferObject<T>;
        },
    };
}
