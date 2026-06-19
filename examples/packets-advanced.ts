import * as st from "../src";

// If you need a utility, just define your own serializer

function literal<T extends string>(
    type: st.Serializer<string>,
    value: T,
): st.Serializer<string, T> {
    return {
        size: type.size,
        write: (ctx, value) => type.write(ctx, value),
        read: (ctx) => {
            const actual = type.read(ctx);
            if (actual !== value) throw new Error("Was not expected");
            return value;
        },
    };
}

export const TypeString = st.string(st.u8());
export type MovementPacket = st.InferOutput<typeof MovementPacket>;
export const MovementPacket = st.object({
    type: literal(TypeString, "movement"),
    x: st.f32(),
    y: st.f32(),
    z: st.f32(),
});

export type RotationPacket = st.InferOutput<typeof RotationPacket>;
export const RotationPacket = st.object({
    type: literal(TypeString, "rotation"),
    yaw: st.f32(),
    pitch: st.f16(),
    roll: st.f16(),
});

export type AttackPacket = st.InferOutput<typeof AttackPacket>;
export const AttackPacket = st.object({
    type: literal(TypeString, "attack"),
});

export type PacketBody = MovementPacket | RotationPacket | AttackPacket;
export type PacketType = PacketBody["type"];

export type Packet = st.InferOutput<typeof Packet>;
export const Packet = st.taggedUnion(
    st.pipe(TypeString, st.noAdvance()), // we use noAdvance to read the type without consuming it
    {
        movement: MovementPacket,
        rotation: RotationPacket,
        attack: AttackPacket,
    } satisfies Record<PacketType, any>,
);
