import * as st from "../src";

export type Entity = st.InferOutput<typeof Entity>;
export const Entity = st.object({
    rotation: st.f64(),
    y: st.f64(),
    z: st.f64(),
});

export type Vec3 = st.InferOutput<typeof Vec3>;
export const Vec3 = st.object({
    x: st.f64(),
    y: st.f64(),
    z: st.f64(),
});
