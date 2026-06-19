//@ts-ignore TODO
import { describe, it, expect } from "bun:test";
import { encodeTest, expectEncodeSize } from "../../utils.test.js";

import * as st from "../../index.js";

function test_float(options: { name: string; serializer: st.Serializer<number>; size: number }) {
    const { name, serializer, size } = options;

    const expectEncodeApproximately = (value: number) => {
        const data = st.write(serializer, value);
        const newValue = st.read(serializer, data);

        if (isNaN(value) && isNaN(newValue)) return;
        if (value === newValue) return;
        if (Math.abs(value - newValue) < 0.000001) return;
        expect(false, "Failed comparsion tests");
    };

    describe(name, () => {
        it(`works in bounds`, () => {
            for (let i = 0; i < 100; i++) {
                expectEncodeApproximately(Math.random());
            }
        });
        it(`works on Infinty`, () => {
            encodeTest(serializer, Infinity);
            encodeTest(serializer, -Infinity);
        });
        it(`works on NaN`, () => {
            encodeTest(serializer, NaN);
        });
        it(`works on 0`, () => {
            encodeTest(serializer, 0);
        });
        it(`works on -0`, () => {
            encodeTest(serializer, -0);
        });

        it(`is right size`, () => {
            for (let i = 0; i < 100; i++) {
                expectEncodeSize(serializer, size, Math.random());
            }
        });
    });
}

test_float({
    name: "st.f16(little)",
    serializer: st.f16("little"),
    size: 2,
});
test_float({
    name: "st.f16(big)",
    serializer: st.f16("big"),
    size: 2,
});

test_float({
    name: "st.f32(little)",
    serializer: st.f32("little"),
    size: 4,
});
test_float({
    name: "st.f32(big)",
    serializer: st.f32("big"),
    size: 4,
});

test_float({
    name: "st.f64(little)",
    serializer: st.f64("little"),
    size: 8,
});
test_float({
    name: "st.f64(big)",
    serializer: st.f64("big"),
    size: 8,
});
