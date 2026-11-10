import { describe, it } from "bun:test";
import { expectEncode, expectEncodeErrors } from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.fixedArray", () => {
    it("encode correctly", () => {
        expectEncode(st.arrayFixed(4, st.u16()), [1, 2, 3, 4]);
    });

    it("works on empty lists", () => {
        expectEncode(st.arrayFixed(0, st.u16()), []);
    });

    it("throws error on invalid size", () => {
        expectEncodeErrors(st.arrayFixed(2, st.u16()), [1]);
    });

    it("throws error on invalid value", () => {
        expectEncodeErrors(st.arrayFixed(2, st.u16()), [1, -1]);
        expectEncodeErrors(st.arrayFixed(2, st.u16()), [2 ** 16 + 1, 0]);
    });
});
