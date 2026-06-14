//@ts-ignore TODO
import { describe, it, expect } from "bun:test";
import { expectEncode, expectEncodeSnapshot, expectError, randint } from "../utils.test";

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
            expectEncode(serializer, start);
            for (let i = 0; i < 100; i++) {
                expectEncode(serializer, randint(start, end));
            }
            expectEncode(serializer, end);
        });

        it(`errors outside bounds`, () => {
            expectError(() => st.write(serializer, start - 1));
            if (!disableMaxCheck) {
                expectError(() => st.write(serializer, end + 1));
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
            expectEncodeSnapshot(serializer, 0);
            expectEncodeSnapshot(serializer, start);
            expectEncodeSnapshot(serializer, start + 10);
            expectEncodeSnapshot(serializer, end - 10);
            expectEncodeSnapshot(serializer, end);
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
