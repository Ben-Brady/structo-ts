//@ts-ignore TODO
import { describe, it, expect } from "bun:test";
import { expectEncode, expectEncodeSnapshot, expectError, randint } from "../utils.test";

import * as st from "../../index";

function test_sint(options: {
    name: string;
    serializer: st.Serializer<number>;
    range: [number, number];
    size: number;
}) {
    const {
        name,
        range: [start, end],
        serializer,
        size,
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
            expectError(() => st.write(serializer, end + 1));
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
