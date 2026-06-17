import * as st from "../structo";

export type MovementPacket = st.InferOutput<typeof MovementPacket>;
export const MovementPacket = st.object({
    x: st.f32(),
    y: st.f32(),
    z: st.f32(),
});

export type RotationPacket = st.InferOutput<typeof RotationPacket>;
export const RotationPacket = st.object({
    yaw: st.f32(),
    pitch: st.f16(),
    roll: st.f16(),
});
export type AttackPacket = st.InferOutput<typeof AttackPacket>;
export const AttackPacket = st.object({});

export type ClientPacket = st.InferOutput<typeof ClientPacket>;
export const ClientPacket = st.taggedUnion(st.u32(), {
    0: MovementPacket,
    1: RotationPacket,
    2: AttackPacket,
});
