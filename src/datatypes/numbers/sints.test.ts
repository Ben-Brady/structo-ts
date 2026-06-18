//@ts-ignore TODO
import { describe, it, expect } from "bun:test";
import {
    encodeTest,
    encodeSnapshotTest,
    expectError,
    randint,
    encodeFailTest,
} from "../../utils.test";

import * as st from "../../index";

function test_sint(options: {
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
            encodeTest(serializer, start);
            for (let i = 0; i < 100; i++) {
                encodeTest(serializer, randint(start, end));
            }
            encodeTest(serializer, end);
        });

        if (!disableRangeCheck) {
            it(`errors outside bounds`, () => {
                encodeFailTest(serializer, start - 1);
                encodeFailTest(serializer, end + 1);
            });
        }

        it(`errors on decimal`, () => {
            expectError(() => st.write(serializer, 0.1));
        });

        it(`is right size`, () => {
            const expectValueSize = (value: number) => {
                const data = st.write(serializer, value);
                expect(data.byteLength).toBe(size);
            };
            for (let i = 0; i < 100; i++) {
                expectValueSize(randint(start, end));
            }
            expectValueSize(start);
            expectValueSize(end);
        });

        it(`matches snapshots`, () => {
            encodeSnapshotTest(serializer, 0);
            encodeSnapshotTest(serializer, start);
            encodeSnapshotTest(serializer, start + 10);
            encodeSnapshotTest(serializer, end - 10);
            encodeSnapshotTest(serializer, end);
        });
    });
}

test_sint({
    name: "st.s8",
    serializer: st.s8(),
    range: [-128, 127],
    size: 1,
});

test_sint({
    name: "st.s16(little)",
    serializer: st.s16("little"),
    range: [-32_768, 32_767],
    size: 2,
});
test_sint({
    name: "st.s16(big)",
    serializer: st.s16("big"),
    range: [-32_768, 32_767],
    size: 2,
});

test_sint({
    name: "st.s32(little)",
    serializer: st.s32("little"),
    range: [-2_147_483_648, 2_147_483_647],
    size: 4,
});
test_sint({
    name: "st.s32(big)",
    serializer: st.s32("big"),
    range: [-2_147_483_648, 2_147_483_647],
    size: 4,
});
test_sint({
    name: "st.s64(little)",
    serializer: st.s64("little"),
    range: [-(2 ** 62), 2 ** 62],
    size: 8,
    disableRangeCheck: true,
});
test_sint({
    name: "st.s64(big)",
    serializer: st.s64("big"),
    range: [-(2 ** 62), 2 ** 62],
    size: 8,
    disableRangeCheck: true,
});
