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
        assertEncodesAndDecodes({
            serializer: st.array(st.u8(), st.u32()),
            value: [1, 2, 3, 4],
        });
    });

    it("works on empty lists", () => {
        assertEncodesAndDecodes({
            serializer: st.array(st.u8(), st.u32()),
            value: [],
        });
    });

    it("throws error on too large array", () => {
        assertEncodeThrows({
            serializer: st.array(st.u8(), st.u32()),
            value: Array.from({ length: 1000 }, () => 0),
        });
    });

    it("throws error on invalid value", () => {
        assertEncodeThrows({
            serializer: st.array(st.u8(), st.u16()),
            value: [-1],
        });
    });

    it(`matches snapshots`, () => {
        assertMatchesSnapshot({
            serializer: st.array(st.s32(), st.string(st.u16())), //
            value: ["foo", "bar", "baz"],
        });
    });
});
