//@ts-ignore TODO
import { describe, it, expect } from "bun:test";
import { bytes, expectEncode, expectEncodeSnapshot } from "../utils.test";

import * as st from "../../index";

describe("st.fastObject", () => {
    const test = st.fastObject({
        a: st.u8(),
        b: st.u8(),
    });

    it("encodes correctly", () => {
        st.write(test, { b: 2, a: 1 });
    });

    it("encode in correct order", () => {
        const data = st.write(test, { b: 2, a: 1 });
        const arr = new Uint8Array(data);
        expect(arr[0]).toBe(1);
        expect(arr[1]).toBe(2);
    });

    it("encodes empty", () => {
        expectEncode(st.fastObject({}), {});
    });

    it(`matches snapshots`, () => {
        expectEncodeSnapshot(
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
