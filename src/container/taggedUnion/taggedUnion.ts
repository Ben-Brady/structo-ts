import { st } from "../../index.ts";

type InferUnion<Tag extends keyof any, Variants extends Record<Tag, st.Serializer<any>>> = {
    [K in keyof Variants]: { type: K; value: st.Infer<Variants[K]> };
}[keyof Variants];

/**
 * `st.taggedUnion` is a union type with a kind
 *
 * Note: `tag` is read/writen first, then the value
 *
 * > Experimental: API might change in the future
 *
 * ---
 *
 * ```
 * st.taggedUnion(st.u32(), {
 *     0: MovementPacket,
 *     1: ClickPacket,
 *     2: MouseMovePacket,
 * })
 * ```
 *
 * @group Utilities
 */
export function taggedUnion<
    Tag extends PropertyKey, //
    Variants extends Record<Tag, st.Serializer<any>>,
>(
    tag: st.Serializer<Tag>,
    variants: Variants & Record<Exclude<keyof Variants, Tag>, never>, // Prevents extra keys not assignable to Tag
): st.Serializer<InferUnion<Tag, Variants>> {
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
