import { st } from "../src/index.ts";
import { benchmark } from "./utils.ts";
import { faker } from "@faker-js/faker";

type User = st.Infer<typeof User>;
const User = st.fastObject({
    id: st.fastString(st.u16()),
    name: st.fastString(st.u16()),
    createdAt: st.asDate(st.u32(), "seconds"),
});

export function generateUserData(size: number): User[] {
    const arr = new Array<User>(size);
    for (let i = 0; i < size; i++) {
        faker.seed(i);
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

    const disableErrorReporting = true;
    return st.write(UserList, users, { disableErrorReporting });
}

function serializeUsingHandwritten(users: User[]) {
    let maxSize = 0;
    for (const user of users) {
        maxSize += 12 + (user.id.length + user.name.length) * 2;
    }

    const buffer = new ArrayBuffer(maxSize);
    const view = new DataView(buffer);
    const encoder = new TextEncoder();

    let offset = 0;
    for (const user of users) {
        const idLength = encoder.encodeInto(
            user.id,
            new Uint8Array(buffer, offset + 2, user.id.length * 2),
        ).written;
        view.setUint16(offset, idLength, true);
        offset += 2 + idLength;

        const nameLength = encoder.encodeInto(
            user.name,
            new Uint8Array(buffer, offset + 2, user.name.length * 2),
        ).written;
        view.setUint16(offset, nameLength, true);
        offset += 2 + nameLength;

        const createdAt = Math.floor(user.createdAt.getTime() / 1000);
        view.setUint32(offset, createdAt, true);
        offset += 4;
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
