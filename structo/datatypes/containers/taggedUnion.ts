import type { InferInput, InferOutput, Serializer } from "../../types";

/**
 * `st.taggedUnion` is a union type with a kind
 *
 * Note: `tag` is read/writen first, then the value
 *
 * ```
 * st.taggedUnion(st.u32(), {
 *     0: MovementPacket,
 *     1: ClickPacket,
 *     2: MouseMovePacket,
 * })
 * ```
 */
export function taggedUnion<
    Tag extends PropertyKey, //
    Variants extends Record<Tag, Serializer<any>>,
>(
    tag: Serializer<Tag>,
    variants: Variants & Record<Exclude<keyof Variants, Tag>, never>, // Prevents extra keys not assignable to Tag
): Serializer<
    {
        [K in keyof Variants]: { type: K; value: InferInput<Variants[K]> };
    }[keyof Variants],
    {
        [K in keyof Variants]: { type: K; value: InferOutput<Variants[K]> };
    }[keyof Variants]
> {
    return {
        write: (ctx, value) => {
            if (!(value.type in variants)) throw new Error(`Unknown type ${String(value.type)}`);

            //@ts-expect-error
            tag.write(ctx, value.type);
            const variant = variants[value.type];
            //@ts-expect-error
            variant.write(ctx, value.value);
        },
        read: (ctx) => {
            const type = tag.read(ctx);
            if (!(type in variants)) throw new Error(`Unknown type ${tag}`);
            const variant = variants[type];
            //@ts-expect-error
            const value = variant.read(ctx);
            return { type, value };
        },
    };
}
