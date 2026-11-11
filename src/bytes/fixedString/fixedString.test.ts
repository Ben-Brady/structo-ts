import { st } from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.fixedString", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.fixedString(3),
            value: "foo",
        });
    });

    it("works on empty strings", () => {
        assertEncodesAndDecodes({
            serializer: st.fixedString(0),
            value: "",
        });
    });

    it("supports characters past UTF-16", () => {
        assertEncodesAndDecodes({
            serializer: st.fixedString(3 * 4),
            value: "𰀇𰀇𰀇",
        });
    });

    it("errors on invalid type", () => {
        assertEncodeThrows({
            serializer: st.fixedString(1),
            value: 8,
        });
        assertEncodeThrows({
            serializer: st.fixedString(4),
            value: true,
        });
    });

    it("works on long strings", () => {
        const size = 2 ** 24;
        assertEncodesAndDecodes({
            serializer: st.fixedString(size),
            value: "A".repeat(size),
        });
    });

    it("errors on shorter strings", () => {
        assertEncodeThrows({
            serializer: st.fixedString(10),
            value: "A".repeat(5),
        });
    });

    it("errors on too long strings", () => {
        assertEncodeThrows({
            serializer: st.fixedString(10),
            value: "A".repeat(11),
        });
    });
});
