import { describe, it, expect } from "bun:test";
import { expectEncode, expectEncodeSnapshot, expectError, randbigint } from "../utils.test";

import * as st from "../../index";

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
            expectEncode(serializer, start);
            for (let i = 0; i < 100; i++) {
                expectEncode(serializer, randbigint(start, end));
            }
            expectEncode(serializer, end);
        });

        it("outside bounds", () => {
            expectError(() => st.write(serializer, start - 1n));
            expectError(() => st.write(serializer, end + 1n));
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
            expectEncodeSnapshot(serializer, 0n);
            expectEncodeSnapshot(serializer, start);
            expectEncodeSnapshot(serializer, start + 10n);
            expectEncodeSnapshot(serializer, end - 10n);
            expectEncodeSnapshot(serializer, end);
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
