import * as st from "../structo";
import { benchmark } from "./utils";

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

function serializeUsingOptimal(entities: Entity[]) {
    const data = new ArrayBuffer(48 * entities.length);
    const view = new DataView(data);

    let offset = 0;

    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];

        view.setUint32(offset, entity.id, true);
        offset += 4;
        view.setUint16(offset, entity.type, true);
        offset += 2;
        view.setUint16(offset, entity.health, true);
        offset += 2;

        view.setFloat64(offset, entity.position.x, true);
        view.setFloat64(offset + 8, entity.position.y, true);
        view.setFloat64(offset + 16, entity.position.z, true);
        offset += 24;

        view.setFloat32(offset, entity.rotation.w, true);
        view.setFloat32(offset + 4, entity.rotation.x, true);
        view.setFloat32(offset + 8, entity.rotation.y, true);
        view.setFloat32(offset + 12, entity.rotation.z, true);
        offset += 16;
    }

    return data;
}

export function run() {
    benchmark({
        library: serializeUsingLibrary,
        optimal: serializeUsingOptimal,
        runs: [
            { name: "10 Entities", data: () => generateData(1), times: 10_000_000 },
            { name: "1k Entities", data: () => generateData(1000), times: 10_000 },
            { name: "25k Entities", data: () => generateData(25_000), times: 500 },
            { name: "100k Entities", data: () => generateData(100_000), times: 100 },
            { name: "1M Entities", data: () => generateData(1_000_000), times: 50 },
        ],
    });
}

import { pathToFileURL } from "node:url";
import process from "node:process";
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    run();
}
