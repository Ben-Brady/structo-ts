import { describe, it } from "bun:test";
import { expectEncodeErrors, expectEncode } from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.string", () => {
    it("encode correctly", () => {
        expectEncode(st.string(st.u8()), "foo");
    });

    it("works on empty strings", () => {
        expectEncode(st.string(st.u32()), "");
    });
    it("supports characters past UTF-16", () => {
        expectEncode(st.string(st.u32()), "𰀇𰀇𰀇");
    });

    it("errors on numbers", () => {
        //@ts-expect-error, intentional mistake
        expectEncodeErrors(st.string(st.u8()), 8);
    });

    it("works on long strings", () => {
        expectEncode(st.string(st.u32()), "A".repeat(2 ** 24));
    });

    it("errors on too long strings", () => {
        expectEncodeErrors(st.string(st.u8()), "A".repeat(256));
    });
});
