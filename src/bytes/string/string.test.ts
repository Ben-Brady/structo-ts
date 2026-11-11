import { st } from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.string", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.string(st.u8()),
            value: "foo",
        });
    });

    it("works on empty strings", () => {
        assertEncodesAndDecodes({
            serializer: st.string(st.u32()),
            value: "",
        });
    });

    it("supports characters past UTF-16", () => {
        assertEncodesAndDecodes({
            serializer: st.string(st.u32()),
            value: "𰀇𰀇𰀇",
        });
    });

    it("errors on numbers", () => {
        assertEncodeThrows({
            serializer: st.string(st.u8()),
            value: 8,
        });
    });

    it("works on long strings", () => {
        assertEncodesAndDecodes({
            serializer: st.string(st.u32()),
            value: "A".repeat(2 ** 24),
        });
    });

    it("errors on too long strings", () => {
        assertEncodeThrows({
            serializer: st.string(st.u8()),
            value: "A".repeat(256),
        });
    });
});
