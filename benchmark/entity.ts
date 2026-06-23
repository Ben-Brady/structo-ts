import * as st from "../src/index.js";
import { benchmark } from "./utils.js";

const generateData = (size: number): Entity[] => {
    const randint = (max: number) => Math.floor(Math.random() * max);
    const arr = new Array<Entity>(size);
    for (let i = 0; i < size; i++) {
        arr[i] = {
            id: randint(2 ** 32),
            type: randint(2 ** 16),
            health: randint(2 ** 16),
            position: {
                x: Math.random(),
                y: Math.random(),
                z: Math.random(),
            },
            rotation: {
                w: Math.random(),
                x: Math.random(),
                y: Math.random(),
                z: Math.random(),
            },
        };
    }
    return arr;
};

type Quaternion = st.Infer<typeof Quaternion>;
const Quaternion = st.fastObject({
    w: st.f32(),
    x: st.f32(),
    y: st.f32(),
    z: st.f32(),
});

type Vec3 = st.Infer<typeof Vec3>;
const Vec3 = st.fastObject({
    x: st.f64(),
    y: st.f64(),
    z: st.f64(),
});

type Entity = st.Infer<typeof Entity>;
const Entity = st.fastObject({
    id: st.u32(),
    type: st.u16(),
    health: st.u16(),
    position: Vec3,
    rotation: Quaternion,
});

function serializeUsingLibrary(entities: Entity[]) {
    const EntityList = st.array(entities.length, Entity);
    return st.write(EntityList, entities);
}

function serializeUsingHandwritten(entities: Entity[]) {
    const data = new ArrayBuffer(48 * entities.length);
    const view = new DataView(data);

    let offset = 0;

    // Outlining to functions is actually faster
    const u16 = (value: number) => {
        view.setUint16(offset, value, true);
        offset += 2;
    };
    const u32 = (value: number) => {
        view.setUint32(offset, value, true);
        offset += 4;
    };
    const f32 = (value: number) => {
        view.setFloat32(offset, value, true);
        offset += 4;
    };
    const f64 = (value: number) => {
        view.setFloat64(offset, value, true);
        offset += 8;
    };

    const encodeEntity = (entity: Entity) => {
        u32(entity.id);
        u16(entity.type);
        u16(entity.health);

        f64(entity.position.x);
        f64(entity.position.y);
        f64(entity.position.z);

        f32(entity.rotation.w);
        f32(entity.rotation.x);
        f32(entity.rotation.y);
        f32(entity.rotation.z);
    };

    for (let i = 0; i < entities.length; i++) {
        encodeEntity(entities[i]);
    }

    return data;
}

export async function generateBenchmarks() {
    await benchmark({
        name: "Entities",
        range: [1, 250_000],
        generateData,
        library: serializeUsingLibrary,
        handwritten: serializeUsingHandwritten,
    });
}

import { pathToFileURL } from "node:url";
import process from "node:process";
import { run } from "mitata";
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    generateBenchmarks();
    await run();
}
