/**
 * These are demonstration tests to show that scratch buffer
 * performs much better than the alternative
 */

import { bench, boxplot, group, run, summary } from "mitata";
import { faker } from "@faker-js/faker";
import { st } from "../../../src/index.ts";

//@ts-ignore
import * as regular from "./regular.ts";
//@ts-ignore
import * as encodeInto from "./encodeInto.ts";
//@ts-ignore
import * as scratch from "./scratch.ts";

const KB = 1024;
const MB = KB * 1024;

const regularString = regular.string(st.u32());
const scratchString = scratch.string(st.u32());
const encodeIntoString = encodeInto.string(st.u32());

// avoid overhead of allocating a new output each time
const buffer = new ArrayBuffer(8 * MB);

function runTests(strings: string[]) {
    function runTest(type: st.Serializer<string>) {
        for (const string of strings) {
            st.writeInto(buffer, 0, type, string);
        }
    }

    summary(() => {
        boxplot(() => {
            bench(`regular`, () => runTest(regularString)).baseline(true);
            bench(`scratch`, () => runTest(scratchString));
            bench(`encodeInto`, () => runTest(encodeIntoString));
        });
    });
}

faker.seed(10);
const smallStrings = Array.from({ length: 10_000 }, () =>
    faker.string.alpha({ length: faker.number.int({ min: 0, max: KB }) }),
);
const mediumStrings = Array.from({ length: 400 }, () =>
    faker.string.alphanumeric(faker.number.int({ min: 2 * KB, max: 32 * KB })),
);
const largeStrings = Array.from({ length: 10 }, () =>
    faker.string.alphanumeric(
        faker.number.int({
            min: 512 * KB,
            max: 4 * MB,
        }),
    ),
);
group("small strings", () => runTests(smallStrings));
group("medium strings", () => runTests(mediumStrings));
group("large strings", () => runTests(largeStrings));
run();
