import { describe, it } from "bun:test";
import { expectEncodeErrors, expectEncode } from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.fixedString", () => {
    it("encode correctly", () => {
        expectEncode(st.fixedString(3), "foo");
    });

    it("works on empty strings", () => {
        expectEncode(st.fixedString(0), "");
    });

    it("supports characters past UTF-16", () => {
        expectEncode(st.fixedString(3 * 4), "𰀇𰀇𰀇");
    });

    it("errors on invalid type", () => {
        //@ts-expect-error, intentional mistake
        expectEncodeErrors(st.fixedString(1), 8);
        //@ts-expect-error, intentional mistake
        expectEncodeErrors(st.fixedString(4), true);
    });

    it("works on long strings", () => {
        const size = 2 ** 24;
        expectEncode(st.fixedString(size), "A".repeat(size));
    });

    it("errors on shorter strings", () => {
        expectEncodeErrors(st.fixedString(10), "A".repeat(5));
    });

    it("errors on too long strings", () => {
        expectEncodeErrors(st.fixedString(10), "A".repeat(11));
    });
});
