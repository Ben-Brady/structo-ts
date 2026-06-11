import * as st from "../../structo";
import { readFileSync } from "node:fs";

const Entity = st.object({
    rotation: st.f64(),
    y: st.f64(),
    z: st.f64(),
});

const Vec3 = st.object({
    x: st.f64(),
    y: st.f64(),
    z: st.f64(),
});
