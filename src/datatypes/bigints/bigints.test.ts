import { describe, it, expect } from "bun:test";
import {
    expectEncode,
    encodeSnapshotTest,
    randbigint,
    expectEncodeErrors,
} from "../../utils.test.ts";

import * as st from "../../index.ts";

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
            expectEncode(serializer, start);
            for (let i = 0; i < 100; i++) {
                expectEncode(serializer, randbigint(start, end));
            }
            expectEncode(serializer, end);
        });

        it("outside bounds", () => {
            expectEncodeErrors(serializer, start - 1n);
            expectEncodeErrors(serializer, end + 1n);
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
