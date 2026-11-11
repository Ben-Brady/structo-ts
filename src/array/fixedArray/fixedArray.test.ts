import { st } from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.fixedArray", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.fixedArray(4, st.u16()),
            value: [1, 2, 3, 4],
        });
    });

    it("works on empty lists", () => {
        assertEncodesAndDecodes({
            serializer: st.fixedArray(0, st.u16()),
            value: [],
        });
    });

    it("throws error on invalid size", () => {
        assertEncodeThrows({
            serializer: st.fixedArray(2, st.u16()),
            value: [1],
        });
    });

    it("throws error on invalid value", () => {
        assertEncodeThrows({
            serializer: st.fixedArray(2, st.u16()),
            value: [1, -1],
        });
        assertEncodeThrows({
            serializer: st.fixedArray(2, st.u16()),
            value: [2 ** 16 + 1, 0],
        });
    });
});
