import * as st from "../../index.ts";
import { describe, expect, expectTypeOf, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.object", () => {
    it("encodes correctly", () => {
        assertEncodesAndDecodes(
            st.object({ a: st.u8(), b: st.u8() }), //
            { b: 2, a: 1 },
        );
    });
    it("encodes nested correctly", () => {
        assertEncodesAndDecodes(
            st.object({
                a: st.object({ a: st.u8() }),
                b: st.u8(),
            }), //
            { a: { a: 2 }, b: 1 },
        );
    });

    it("encode in correct order", () => {
        const data = st.write(
            st.object({
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
        assertEncodesAndDecodes(st.object({}), {});
    });

    it(`matches snapshots`, () => {
        assertMatchesSnapshot(
            st.object({
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

    expectTypeOf(
        st.object({
            number: st.u32(),
            string: st.string(st.u32()),
        }),
    ).toEqualTypeOf<
        st.Serializer<{
            number: number;
            string: string;
        }>
    >();
});
