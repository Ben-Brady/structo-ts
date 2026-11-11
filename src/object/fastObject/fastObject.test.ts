import * as st from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.fastObject", () => {
    it("encodes correctly", () => {
        st.write(
            st.fastObject({
                a: st.u8(),
                b: st.u8(),
            }),
            { b: 2, a: 1 },
        );
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

    it("encodes bad key in child", () => {
        const schema = st.fastObject({
            a: st.fastObject({
                "b-c": st.u8(),
                "": st.u8(),
                '"': st.u8(),
                "'": st.u8(),
            }),
        });
        st.write(schema, {
            a: { "b-c": 1, "": 1, "'": 1, '"': 1 },
        });
    });

    it("encode in correct order", () => {
        const data = st.write(
            st.fastObject({
                a: st.u8(),
                b: st.u8(),
            }),
            { b: 2, a: 1 },
        );
        const arr = new Uint8Array(data);
        expect(arr[0]).toBe(1);
        expect(arr[1]).toBe(2);
    });

    it("encodes empty", () => {
        assertEncodesAndDecodes(st.fastObject({}), {});
    });

    it(`matches snapshots`, () => {
        assertMatchesSnapshot(
            st.fastObject({
                number: st.u32(),
                puppy: st.string(st.s32()),
                buffer: st.fixedBytes(4),
            }),
            {
                number: 1,
                puppy: "woof woof bark bark",
                buffer: new Uint8Array([19, 87, 19, 83]),
            },
        );
    });
});
