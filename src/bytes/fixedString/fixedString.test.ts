import * as st from "../../index.ts";
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
        assertEncodesAndDecodes(st.fixedString(3), "foo");
    });

    it("works on empty strings", () => {
        assertEncodesAndDecodes(st.fixedString(0), "");
    });

    it("supports characters past UTF-16", () => {
        assertEncodesAndDecodes(st.fixedString(3 * 4), "𰀇𰀇𰀇");
    });

    it("errors on invalid type", () => {
        //@ts-expect-error, intentional mistake
        assertEncodeThrows(st.fixedString(1), 8);
        //@ts-expect-error, intentional mistake
        assertEncodeThrows(st.fixedString(4), true);
    });

    it("works on long strings", () => {
        const size = 2 ** 24;
        assertEncodesAndDecodes(st.fixedString(size), "A".repeat(size));
    });

    it("errors on shorter strings", () => {
        assertEncodeThrows(st.fixedString(10), "A".repeat(5));
    });

    it("errors on too long strings", () => {
        assertEncodeThrows(st.fixedString(10), "A".repeat(11));
    });
});
