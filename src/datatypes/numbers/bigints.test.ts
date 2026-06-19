import { describe, it, expect } from "bun:test";
import { encodeTest, encodeSnapshotTest, randbigint, encodeFailTest } from "../../utils.test.js";

import * as st from "../../index.js";

function test_bigint(options: {
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
            encodeTest(serializer, start);
            for (let i = 0; i < 100; i++) {
                encodeTest(serializer, randbigint(start, end));
            }
            encodeTest(serializer, end);
        });

        it("outside bounds", () => {
            encodeFailTest(serializer, start - 1n);
            encodeFailTest(serializer, end + 1n);
        });

        it(`is right size`, () => {
            const expectValueSize = (value: bigint) => {
                const data = st.write(serializer, value);
                expect(data.byteLength).toBe(size);
            };
            for (let i = 0; i < 100; i++) {
                expectValueSize(randbigint(start, end));
            }
            expectValueSize(start);
            expectValueSize(end);
        });

        it(`matches snapshots`, () => {
            encodeSnapshotTest(serializer, 0n);
            encodeSnapshotTest(serializer, start);
            encodeSnapshotTest(serializer, start + 10n);
            encodeSnapshotTest(serializer, end - 10n);
            encodeSnapshotTest(serializer, end);
        });
    });
}

test_bigint({
    name: "st.u64(little)",
    serializer: st.u64Bigint("little"),
    range: [0n, 18_446_744_073_709_551_615n],
    size: 8,
});
test_bigint({
    name: "st.u64(big)",
    serializer: st.u64Bigint("big"),
    range: [0n, 18_446_744_073_709_551_615n],
    size: 8,
});

test_bigint({
    name: "st.s64(little)",
    serializer: st.s64Bigint("little"),
    range: [-9_223_372_036_854_775_808n, 9_223_372_036_854_775_807n],
    size: 8,
});
test_bigint({
    name: "st.s64(big)",
    serializer: st.s64Bigint("big"),
    range: [-9_223_372_036_854_775_808n, 9_223_372_036_854_775_807n],
    size: 8,
});
