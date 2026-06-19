import * as st from "../src";
import { benchmark } from "./utils";

type User = st.Infer<typeof User>;
const User = st.fastObject({
    id: st.u64(),
    name: st.string(st.u32()),
    createdAt: st.pipe(
        st.f64(),
        st.encode({
            encode: (v: Date) => v.getTime(),
            decode: (v: number) => new Date(v),
        }),
    ),
});

const generateData = (size: number): User[] => {
    const randint = (max: number) => Math.floor(Math.random() * max);
    const randstring = (length: number) =>
        Array.from({ length }, () => String.fromCharCode(Math.floor(Math.random() * 255))).join("");

    const arr = new Array<User>(size);
    for (let i = 0; i < size; i++) {
        arr[i] = {
            id: randint(2 ** 32),
            name: randstring(randint(32)),
            createdAt: new Date(),
        };
    }
    return arr;
};

function serializeUsingLibrary(entities: User[]) {
    const UserList = st.array(entities.length, User);
    return st.write(UserList, entities);
}

function serializeUsingOptimal(users: User[]) {
    const encoder = new TextEncoder();

    let totalSize = 0;
    let names: Uint8Array[] = new Array(users.length);
    for (let i = 0; i < users.length; i++) {
        let data = encoder.encode(users[i].name);
        names[i] = data;
        totalSize += 8 + 4 + data.byteLength + 8;
    }

    const buffer = new ArrayBuffer(totalSize);
    const view = new DataView(buffer);

    let offset = 0;
    for (let i = 0; i < users.length; i++) {
        const { id, createdAt } = users[i];

        view.setBigUint64(offset, BigInt(id), true);
        offset += 8;

        const name = names[i];
        view.setUint32(offset, name.byteLength, true);
        offset += 4;

        const arr = new Uint8Array(buffer);
        arr.set(names[i], offset);
        offset += name.byteLength;

        view.setFloat64(offset, createdAt.getTime(), true);
        offset += 8;
    }

    return buffer;
}

export function run() {
    benchmark({
        library: serializeUsingLibrary,
        optimal: serializeUsingOptimal,
        runs: [
            { name: "10 Users", data: () => generateData(1), times: 5_000_000 },
            { name: "1k Users", data: () => generateData(1_000), times: 25_000 },
            { name: "25k Users", data: () => generateData(25_000), times: 1000 },
            { name: "100k Users", data: () => generateData(100_000), times: 500 },
            { name: "1M Users", data: () => generateData(1_000_000), times: 25 },
        ],
    });
}

import { pathToFileURL } from "node:url";
import process from "node:process";
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    run();
}
