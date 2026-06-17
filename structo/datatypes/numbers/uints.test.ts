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

function test_uint(options: {
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
            encodeTest(serializer, start);
            for (let i = 0; i < 100; i++) {
                encodeTest(serializer, randint(start, end));
            }
            encodeTest(serializer, end);
        });

        it(`errors outside bounds`, () => {
            encodeFailTest(serializer, start - 1);
            if (!disableMaxCheck) {
                encodeFailTest(serializer, end + 1);
            }
        });

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

test_uint({
    name: "st.u8",
    serializer: st.u8(),
    range: [0, 255],
    size: 1,
});

test_uint({
    name: "st.u16(little)",
    serializer: st.u16("little"),
    range: [0, 65_535],
    size: 2,
});
test_uint({
    name: "st.u16(big)",
    serializer: st.u16("big"),
    range: [0, 65_535],
    size: 2,
});

test_uint({
    name: "st.u32(little)",
    serializer: st.u32("little"),
    range: [0, 4_294_967_295],
    size: 4,
});
test_uint({
    name: "st.u32(big)",
    serializer: st.u32("big"),
    range: [0, 4_294_967_295],
    size: 4,
});

test_uint({
    name: "st.u64(little)",
    serializer: st.u64("little"),
    range: [0, 2 ** 63],
    size: 8,
    disableMaxCheck: true,
});
test_uint({
    name: "st.u64(big)",
    serializer: st.u64("big"),
    range: [0, 2 ** 63],
    size: 8,
    disableMaxCheck: true,
});
