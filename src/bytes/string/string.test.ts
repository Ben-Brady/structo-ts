import * as st from "../../index.ts";
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
        assertEncodesAndDecodes(st.string(st.u8()), "foo");
    });

    it("works on empty strings", () => {
        assertEncodesAndDecodes(st.string(st.u32()), "");
    });
    it("supports characters past UTF-16", () => {
        assertEncodesAndDecodes(st.string(st.u32()), "𰀇𰀇𰀇");
    });

    it("errors on numbers", () => {
        //@ts-expect-error, intentional mistake
        assertEncodeThrows(st.string(st.u8()), 8);
    });

    it("works on long strings", () => {
        assertEncodesAndDecodes(st.string(st.u32()), "A".repeat(2 ** 24));
    });

    it("errors on too long strings", () => {
        assertEncodeThrows(st.string(st.u8()), "A".repeat(256));
    });
});
