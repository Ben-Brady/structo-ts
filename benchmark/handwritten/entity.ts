import { st } from "../../src/index.ts";
import { benchmark } from "./utils.ts";

export function generateEntityData(size: number): Entity[] {
    return Array.from({ length: size }, (_, i): Entity => {
        faker.seed(i);
        return {
            id: faker.number.int({ max: 2 ** 32 - 1 }),
            type: faker.number.int({ max: 2 ** 16 - 1 }),
            health: faker.number.int({ max: 2 ** 16 - 1 }),
            position: {
                x: faker.number.float({ min: -9999999, max: 9999999 }),
                y: faker.number.float({ min: -9999999, max: 9999999 }),
                z: faker.number.float({ min: -9999999, max: 9999999 }),
            },
            rotation: {
                x: faker.number.float({ min: -9999999, max: 9999999 }),
                y: faker.number.float({ min: -9999999, max: 9999999 }),
                z: faker.number.float({ min: -9999999, max: 9999999 }),
                w: faker.number.float({ min: -9999999, max: 9999999 }),
            },
        };
    }).map((v) => JSON.parse(JSON.stringify(v))); // force shape loss
}

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

export function serializeUsingLibrary(entities: Entity[]) {
    const EntityList = st.fixedArray(entities.length, Entity);
    return st.write(EntityList, entities, { disableErrorReporting: true });
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

export function generateBenchmarks(compact: boolean) {
    benchmark({
        name: "Entities",
        sizes: [1, 10, 100, 250, 1000, 25_000, 100_000],
        compact,
        generateData: generateEntityData,
        library: serializeUsingLibrary,
        handwritten: serializeUsingHandwritten,
    });
}

import { pathToFileURL } from "node:url";
import process from "node:process";
import { run } from "mitata";
import { faker } from "@faker-js/faker";
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    generateBenchmarks(false);
    await run();
}
