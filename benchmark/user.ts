import { st } from "../src/index.ts";
import { benchmark } from "./utils.ts";
import { faker } from "@faker-js/faker";

type User = st.Infer<typeof User>;
const User = st.object({
    id: st.string(st.u16()),
    name: st.string(st.u16()),
    createdAt: st.asDate(st.u32(), "seconds"),
});

export function generateUserData(size: number): User[] {
    const arr = new Array<User>(size);
    for (let i = 0; i < size; i++) {
        arr[i] = {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            createdAt: faker.date.anytime(),
        };
    }
    return arr;
}

export function serializeUsingLibrary(users: User[]) {
    const UserList = st.fixedArray(users.length, User);
    return st.write(UserList, users, { disableErrorReporting: true });
}

function serializeUsingHandwritten(users: User[]) {
    const encoder = new TextEncoder();

    let maxSize = 0;
    for (const user of users) {
        maxSize += 2;
        maxSize += user.name.length * 2;
        maxSize += 2;
        maxSize += user.id.length * 2;
        maxSize += 8;
    }

    const buffer = new ArrayBuffer(maxSize);
    const view = new DataView(buffer);

    const string = (text: string) => {
        const result = encoder.encodeInto(
            text,
            new Uint8Array(buffer, offset + 2, text.length * 2),
        );
        view.setUint16(offset, result.written, true);
        offset += 2 + result.written;
    };
    const u32 = (value: number) => {
        view.setUint32(offset, value, true);
        offset += 4;
    };

    let offset = 0;
    for (const user of users) {
        string(user.id);
        string(user.name);
        u32(Math.floor(user.createdAt.getTime() / 1000));
    }

    return buffer.transferToFixedLength(offset);
}

export async function generateBenchmarks() {
    benchmark({
        name: "Users",
        range: [1, 250_000],
        generateData: generateUserData,
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
