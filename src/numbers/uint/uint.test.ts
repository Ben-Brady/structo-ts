import * as st from "../../index.ts";
import { describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

const randInt = (min: number, max: number) => faker.number.int({ min, max });

function runUIntTests(options: {
    name: string;
    serializer: st.Serializer<number>;
    range: [number, number];
    size: number;
    disableMaxCheck?: boolean;
}) {
    const {
        name,
        range: [start, end],
        serializer,
        size,
        disableMaxCheck,
    } = options;

    describe(name, () => {
        it(`works in bounds`, () => {
            assertEncodesAndDecodes(serializer, start);
            for (let i = 0; i < 100; i++) {
                assertEncodesAndDecodes(serializer, randInt(start, end));
            }
            assertEncodesAndDecodes(serializer, end);
        });

        it(`errors outside bounds`, () => {
            assertEncodeThrows(serializer, start - 1);
            if (!disableMaxCheck) {
                assertEncodeThrows(serializer, end + 1);
            }
        });

        it(`errors on decimal`, () => {
            assertEncodeThrows(serializer, 0.1);
        });

        it(`is right size`, () => {
            const expectValueSize = (value: number) => {
                const data = st.write(serializer, value);
                expect(data.byteLength).toBe(size);
            };
            for (let i = 0; i < 100; i++) {
                expectValueSize(randInt(start, end));
            }
            expectValueSize(start);
            expectValueSize(end);
        });

        it(`matches snapshots`, () => {
            assertMatchesSnapshot(serializer, 0);
            assertMatchesSnapshot(serializer, start);
            assertMatchesSnapshot(serializer, start + 10);
            assertMatchesSnapshot(serializer, end - 10);
            assertMatchesSnapshot(serializer, end);
        });
    });
}

runUIntTests({
    name: "st.u8",
    serializer: st.u8(),
    range: [0, 255],
    size: 1,
});

runUIntTests({
    name: "st.u16(little)",
    serializer: st.u16("little"),
    range: [0, 65_535],
    size: 2,
});
runUIntTests({
    name: "st.u16(big)",
    serializer: st.u16("big"),
    range: [0, 65_535],
    size: 2,
});

runUIntTests({
    name: "st.u32(little)",
    serializer: st.u32("little"),
    range: [0, 4_294_967_295],
    size: 4,
});
runUIntTests({
    name: "st.u32(big)",
    serializer: st.u32("big"),
    range: [0, 4_294_967_295],
    size: 4,
});

runUIntTests({
    name: "st.u64(little)",
    serializer: st.u64("little"),
    range: [0, 2 ** 63],
    size: 8,
    disableMaxCheck: true,
});
runUIntTests({
    name: "st.u64(big)",
    serializer: st.u64("big"),
    range: [0, 2 ** 63],
    size: 8,
    disableMaxCheck: true,
});
