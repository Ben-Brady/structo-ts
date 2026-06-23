import * as st from "../src/index.js";
import { benchmark } from "./utils.js";

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

function serializeUsingLibrary(users: User[]) {
    const UserList = st.array(users.length, User);
    return st.write(UserList, users);
}

function serializeUsingHandwritten(users: User[]) {
    const encoder = new TextEncoder();

    let totalSize = 0;
    let names: Uint8Array[] = new Array(users.length);
    for (let i = 0; i < users.length; i++) {
        let data = encoder.encode(users[i].name);
        names[i] = data;
        totalSize += 8 + 4 + data.byteLength + 8;
    }

    const buffer = new ArrayBuffer(totalSize);
    const arr = new Uint8Array(buffer);
    const view = new DataView(buffer);

    const bytes = (value: Uint8Array) => {
        arr.set(value, offset);
        offset += value.byteLength;
    };
    const u32 = (value: number) => {
        view.setUint32(offset, value, true);
        offset += 4;
    };
    const u64 = (value: number) => {
        view.setBigUint64(offset, BigInt(value), true);
        offset += 8;
    };
    const f64 = (value: number) => {
        view.setFloat64(offset, value, true);
        offset += 8;
    };

    let offset = 0;
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const name = names[i];

        u64(user.id);
        u32(name.byteLength);
        bytes(name);
        f64(user.createdAt.getTime());
    }

    return buffer;
}

export async function generateBenchmarks() {
    await benchmark({
        name: "Users",
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
