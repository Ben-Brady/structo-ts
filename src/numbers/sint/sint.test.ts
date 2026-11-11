import { st } from "../../index.ts";
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

function runSIntTests(options: {
    name: string;
    serializer: st.Serializer<number>;
    range: [number, number];
    size: number;
    disableRangeCheck?: boolean;
}) {
    const {
        name,
        range: [start, end],
        serializer,
        size,
        disableRangeCheck,
    } = options;

    describe(name, () => {
        it(`works in bounds`, () => {
            assertEncodesAndDecodes({ serializer, value: start });
            assertEncodesAndDecodes({ serializer, value: end });
            for (let i = 0; i < 100; i++) {
                assertEncodesAndDecodes({ serializer, value: randInt(start, end) });
            }
        });

        if (!disableRangeCheck) {
            it(`errors outside bounds`, () => {
                assertEncodeThrows({ serializer, value: start - 1 });
                assertEncodeThrows({ serializer, value: end + 1 });
            });
        }

        it(`errors on decimal`, () => {
            assertEncodeThrows({ serializer, value: 0.1 });
        });

        it(`is right size`, () => {
            assertEncodesAsSize({ serializer, size, value: start });
            assertEncodesAsSize({ serializer, size, value: end });
            for (let i = 0; i < 100; i++) {
                assertEncodesAsSize({
                    serializer,
                    size,
                    value: randInt(start, end),
                });
            }
        });

        it(`matches snapshots`, () => {
            assertMatchesSnapshot({ serializer, value: 0 });
            assertMatchesSnapshot({ serializer, value: start });
            assertMatchesSnapshot({ serializer, value: start + 10 });
            assertMatchesSnapshot({ serializer, value: end - 10 });
            assertMatchesSnapshot({ serializer, value: end });
        });
    });
}

runSIntTests({
    name: "st.s8",
    serializer: st.s8(),
    range: [-128, 127],
    size: 1,
});

runSIntTests({
    name: "st.s16(little)",
    serializer: st.s16("little"),
    range: [-32_768, 32_767],
    size: 2,
});
runSIntTests({
    name: "st.s16(big)",
    serializer: st.s16("big"),
    range: [-32_768, 32_767],
    size: 2,
});

runSIntTests({
    name: "st.s32(little)",
    serializer: st.s32("little"),
    range: [-2_147_483_648, 2_147_483_647],
    size: 4,
});
runSIntTests({
    name: "st.s32(big)",
    serializer: st.s32("big"),
    range: [-2_147_483_648, 2_147_483_647],
    size: 4,
});
runSIntTests({
    name: "st.s64(little)",
    serializer: st.s64("little"),
    range: [-(2 ** 62), 2 ** 62],
    size: 8,
    disableRangeCheck: true,
});
runSIntTests({
    name: "st.s64(big)",
    serializer: st.s64("big"),
    range: [-(2 ** 62), 2 ** 62],
    size: 8,
    disableRangeCheck: true,
});
