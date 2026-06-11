import * as st from "../structo";

type Quaternion = st.Infer<typeof Quaternion>;
const Quaternion = st.object({
    w: st.f32(),
    x: st.f32(),
    y: st.f32(),
    z: st.f32(),
});

type Vec3 = st.Infer<typeof Vec3>;
const Vec3 = st.object({
    x: st.f64(),
    y: st.f64(),
    z: st.f64(),
});

type Entity = st.Infer<typeof Entity>;
const Entity = st.object({
    id: st.u32(),
    type: st.u8(),
    health: st.u16(),
    rotation: Quaternion,
    position: Vec3,
});

const randint = (max: number) => Math.floor(Math.random() * max);

const generateData = (size: number): Entity[] =>
    Array.from(
        { length: size },
        (): Entity => ({
            id: randint(2 ** 32),
            type: randint(2 ** 8),
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
        }),
    );

function measure(callback: () => void): number {
    const start = performance.now();
    callback();
    return performance.now() - start;
}

function serializeUsingLibrary(size: number) {
    const EntityList = st.array(size, Entity);

    const entities = generateData(size);
    const ms = measure(() => st.write(EntityList, entities));
    console.log(`  Library: ${ms.toFixed(1)}ms`);
}

function serializeUsingNative(size: number) {
    const entities = generateData(size);
    const ms = measure(() => {
        const data = new ArrayBuffer(63 * size);
        const view = new DataView(data);

        let offset = 0;
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];

            view.setUint32(offset, entity.id);
            offset += 4;

            view.setUint8(offset, entity.type);
            offset += 1;

            view.setUint16(offset, entity.health);
            offset += 2;

            view.setFloat64(offset, entity.position.x);
            offset += 8;
            view.setFloat64(offset, entity.position.y);
            offset += 8;
            view.setFloat64(offset, entity.position.z);
            offset += 8;

            view.setFloat32(offset, entity.rotation.w);
            offset += 4;
            view.setFloat32(offset, entity.rotation.x);
            offset += 4;
            view.setFloat32(offset, entity.rotation.y);
            offset += 4;
            view.setFloat32(offset, entity.rotation.z);
            offset += 4;
        }
    });
    console.log(`  Native: ${ms.toFixed(1)}ms`);
}

console.log(`5M entites:`);
serializeUsingLibrary(5_000_000);
// serializeUsingNative(5_000_000);

console.log(`1M entites:`);
serializeUsingLibrary(1_000_000);
// serializeUsingNative(1_000_000);

console.log(`10k entites:`);
serializeUsingLibrary(10_000);
// serializeUsingNative(10_000);

console.log(`2.5k entites:`);
serializeUsingLibrary(2_500);
// serializeUsingNative(2_500);
