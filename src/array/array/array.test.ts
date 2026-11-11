import * as st from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.array", () => {
    it("encode correctly", () => {
        const spec = st.array(st.u8(), st.u32());
        assertEncodesAndDecodes(spec, [1, 2, 3, 4]);
    });

    it("works on empty lists", () => {
        const spec = st.array(st.u8(), st.u32());
        assertEncodesAndDecodes(spec, []);
    });

    it("throws error on too large array", () => {
        assertEncodeThrows(
            st.array(st.u8(), st.u32()),
            Array.from({ length: 10000 }, () => 0),
        );
    });

    it("throws error on invalid value", () => {
        assertEncodeThrows(st.array(st.u8(), st.u16()), [-1]);
    });

    it(`matches snapshots`, () => {
        assertMatchesSnapshot(
            st.array(st.s32(), st.string(st.u16())), //
            ["foo", "bar", "baz"],
        );
    });
});
