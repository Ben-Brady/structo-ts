//@ts-ignore TODO
import { describe, it, expect } from "bun:test";
import { bytes, encodeTest, encodeSnapshotTest } from "../../utils.test";

import * as st from "../../index";

describe("st.fastObject", () => {
    const spec = st.fastObject({
        a: st.u8(),
        b: st.u8(),
    });

    it("encodes correctly", () => {
        st.write(spec, { b: 2, a: 1 });
    });
    it("encodes nest correctly", () => {
        st.write(
            st.fastObject({
                a: st.fastObject({
                    cat: st.u8(),
                    puppy: st.string(st.u8()),
                }),
                b: st.u8(),
            }),
            {
                a: { cat: 1, puppy: "woof" },
                b: 3,
            },
        );
    });

    it("encode in correct order", () => {
        const data = st.write(spec, { b: 2, a: 1 });
        const arr = new Uint8Array(data);
        expect(arr[0]).toBe(1);
        expect(arr[1]).toBe(2);
    });

    it("encodes empty", () => {
        encodeTest(st.fastObject({}), {});
    });

    it(`matches snapshots`, () => {
        encodeSnapshotTest(
            st.fastObject({
                number: st.u32(),
                puppy: st.string(st.s32()),
                buffer: st.bytes(4),
            }),
            {
                number: 1,
                puppy: "woof woof bark bark",
                buffer: bytes([19, 87, 19, 83]),
            },
        );
    });
});
