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

const randBigInt = (min: number | bigint, max: number | bigint) =>
    faker.number.bigInt({ min, max });

function runBigintTests(options: {
    name: string;
    serializer: st.Serializer<bigint>;
    range: [bigint, bigint];
    size: number;
}) {
    const {
        name,
        range: [start, end],
        serializer,
        size,
    } = options;
    describe(name, () => {
        it("works in bounds", () => {
            assertEncodesAndDecodes(serializer, start);
            for (let i = 0; i < 100; i++) {
                assertEncodesAndDecodes(serializer, randBigInt(start, end));
            }
            assertEncodesAndDecodes(serializer, end);
        });

        it("outside bounds", () => {
            assertEncodeThrows(serializer, start - 1n);
            assertEncodeThrows(serializer, end + 1n);
        });

        it(`is right size`, () => {
            const expectValueSize = (value: bigint) => {
                const data = st.write(serializer, value);
                expect(data.byteLength).toBe(size);
            };
            for (let i = 0; i < 100; i++) {
                expectValueSize(randBigInt(start, end));
            }
            expectValueSize(start);
            expectValueSize(end);
        });

        it(`matches snapshots`, () => {
            assertMatchesSnapshot(serializer, 0n);
            assertMatchesSnapshot(serializer, start);
            assertMatchesSnapshot(serializer, start + 10n);
            assertMatchesSnapshot(serializer, end - 10n);
            assertMatchesSnapshot(serializer, end);
        });
    });
}

runBigintTests({
    name: "st.u64(little)",
    serializer: st.u64BigInt("little"),
    range: [0n, 18_446_744_073_709_551_615n],
    size: 8,
});
runBigintTests({
    name: "st.u64(big)",
    serializer: st.u64BigInt("big"),
    range: [0n, 18_446_744_073_709_551_615n],
    size: 8,
});

runBigintTests({
    name: "st.s64(little)",
    serializer: st.s64BigInt("little"),
    range: [-9_223_372_036_854_775_808n, 9_223_372_036_854_775_807n],
    size: 8,
});
runBigintTests({
    name: "st.s64(big)",
    serializer: st.s64BigInt("big"),
    range: [-9_223_372_036_854_775_808n, 9_223_372_036_854_775_807n],
    size: 8,
});
