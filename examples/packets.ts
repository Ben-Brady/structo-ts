import { st } from "../src";

type PacketType = (typeof PacketType)[keyof typeof PacketType];
const PacketType = {
    MOVEMENT: 0,
    ROTATION: 1,
    ATTACK_PLAYER: 2,
} as const satisfies Record<string, number>;

export type Packet = st.Infer<typeof Packet>;
export const Packet = st.lazy(() =>
    st.taggedUnion(st.u8(), {
        [PacketType.MOVEMENT]: MovementPacket,
        [PacketType.ROTATION]: RotationPacket,
        [PacketType.ATTACK_PLAYER]: AttackPlayerPacket,
    }),
);

export type MovementPacket = st.Infer<typeof MovementPacket>;
export const MovementPacket = st.object({
    x: st.f32(),
    y: st.f32(),
    z: st.f32(),
});

export type RotationPacket = st.Infer<typeof RotationPacket>;
export const RotationPacket = st.object({
    yaw: st.f32(),
    pitch: st.f16(),
    roll: st.f16(),
});

export type AttackPlayerPacket = st.Infer<typeof AttackPlayerPacket>;
export const AttackPlayerPacket = st.object({
    playerId: st.u32(),
});

function parsePacket(data: ArrayBuffer) {
    const packet = st.read(Packet, data);

    if (packet.type === PacketType.MOVEMENT) {
        const { x, y, z } = packet.value;
        console.log(`Moving to ${x},${y},${z}`);
    }

    if (packet.type === PacketType.ROTATION) {
        const { pitch, roll, yaw } = packet.value;
        console.log(`Looking at pitch=${pitch} roll=${roll} yaw=${yaw}`);
    }

    if (packet.type === PacketType.ATTACK_PLAYER) {
        const { playerId } = packet.value;
        console.log(`Attacking player ${playerId}`);
    }
}

const data = st.write(Packet, {
    type: PacketType.MOVEMENT,
    value: {
        x: 103.0,
        y: 16.0,
        z: -143.0,
    },
});
parsePacket(data);
