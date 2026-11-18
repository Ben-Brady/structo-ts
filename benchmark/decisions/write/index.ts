/**
 * These are demonstration tests to show that scratch buffer
 * performs much better than the alternative
 */

import { bench, boxplot, group, run, summary } from "mitata";
import { faker } from "@faker-js/faker";
import { st } from "../../../src/index.ts";

//@ts-ignore
import * as virtual from "./virtual.ts";
//@ts-ignore
import * as regular from "./regular.ts";

type User = st.Infer<typeof User>;
const User = st.fastObject({
    id: st.fastString(st.u16()),
    name: st.fastString(st.u16()),
    createdAt: st.u32(),
    tags: st.array(st.u16(), st.string(st.u16())),
});

const Users = st.array(st.u32(), User);

function runTests(users: User[]) {
    boxplot(() => {
        summary(() => {
            bench(`regular`, () => regular.write(Users, users))
                .compact(true)
                .baseline(true);
            bench(`virtual`, () => virtual.write(Users, users)) //
                .compact(true);
        });
    });
}

export function generateUserData(size: number): User[] {
    const arr = Array.from({ length: size }, (_, i): User => {
        faker.seed(i);
        const tagCount = faker.number.int({ min: 1, max: 16 });

        return {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            createdAt: Math.floor(faker.date.anytime().getTime() / 1000),
            tags: Array.from(
                { length: tagCount }, //
                () => faker.string.uuid(),
            ),
        };
    }); // force shape loss
    return arr;
}

console.log("Generating Users...");
const users = generateUserData(100_000);
console.log("Running Tests...");
group("1 users", () => runTests(users.slice(0, 1)));
group("100 users", () => runTests(users.slice(0, 100)));
group("10,000 users", () => runTests(users.slice(0, 10_000)));
group("50,000 users", () => runTests(users.slice(0, 50_000)));
group("100,000 users", () => runTests(users.slice(0, 100_000)));
run();
