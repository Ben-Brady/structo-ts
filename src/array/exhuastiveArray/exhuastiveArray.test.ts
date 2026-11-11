import * as st from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.arrayExhaustive", () => {
    it("encode correctly", () => {
        const spec = st.exhuastiveArray(st.u32());
        assertEncodesAndDecodes(spec, [1, 2, 3, 4]);
    });

    it("works on empty arrays", () => {
        const spec = st.exhuastiveArray(st.u32());
        assertEncodesAndDecodes(spec, []);
    });

    it("accepts large array", () => {
        const spec = st.exhuastiveArray(st.u32());
        assertEncodesAndDecodes(
            spec,
            Array.from({ length: 10000 }, (_, i) => i),
        );
    });

    it("works composed", () => {
        const spec = st.object({
            a: st.u32(),
            b: st.u8(),
            c: st.exhuastiveArray(st.u32()),
        });
        assertEncodesAndDecodes(spec, { a: 1, b: 2, c: [3, 4, 5, 6, 7] });
    });

    it("throws error on invalid value", () => {
        assertEncodeThrows(st.exhuastiveArray(st.u16()), [-1]);
    });

    it("nested arrays encode correctly", () => {
        assertEncodesAndDecodes(
            st.exhuastiveArray(st.exhuastiveArray(st.u16())), //
            [[1, 2]],
        );
    });

    it(`matches snapshots`, () => {
        assertMatchesSnapshot(
            st.exhuastiveArray(st.string(st.u16())), //
            ["foo", "bar", "baz"],
        );
        assertMatchesSnapshot(
            st.exhuastiveArray(st.u8()), //
            [0, 1, 2, 3],
        );
    });
});
