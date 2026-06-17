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
 *
 */
export function taggedUnion<TTag extends string | number, TType extends Serializer<any>>(
    tag: Serializer<TTag>,
    variants: Record<TTag, TType>,
): Serializer<{ type: TTag; value: InferInput<TType> }, { type: TTag; value: InferOutput<TType> }> {
    return {
        write: (ctx, value) => {
            if (!(value.type in variants)) throw new Error(`Unknown type ${value.type}`);

            tag.write(ctx, value.type);
            const variant = variants[value.type];
            variant.write(ctx, value.value);
        },
        read: (ctx) => {
            const type = tag.read(ctx);
            if (!(type in variants)) throw new Error(`Unknown type ${tag}`);
            const variant = variants[type];
            const value = variant.read(ctx);
            return { type, value };
        },
    };
}
