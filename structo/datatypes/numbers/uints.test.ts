import { describe, it, expect } from "bun:test";
import { expectEncode, expectError, randint } from "../utils.test";

import * as st from "../../index";

function test_uint(options: {
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
            expectError(() => st.serialize(serializer, start - 1));
            expectError(() => st.serialize(serializer, end + 1));
        });

        it(`errors on decimal`, () => {
            expectError(() => st.serialize(serializer, 0.1));
        });

        it(`is right size`, () => {
            const expectValueSize = (value: number) => {
                const data = st.serialize(serializer, value);
                expect(data.byteLength).toBe(size);
            };
            for (let i = 0; i < 100; i++) {
                expectValueSize(randint(start, end));
            }
            expectValueSize(start);
            expectValueSize(end);
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
