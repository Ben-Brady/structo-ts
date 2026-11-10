import { describe, it } from "bun:test";
import { expectEncode, expectEncodeErrors } from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.fixedArray", () => {
    it("encode correctly", () => {
        expectEncode(st.fixedArray(4, st.u16()), [1, 2, 3, 4]);
    });

    it("works on empty lists", () => {
        expectEncode(st.fixedArray(0, st.u16()), []);
    });

    it("throws error on invalid size", () => {
        expectEncodeErrors(st.fixedArray(2, st.u16()), [1]);
    });

    it("throws error on invalid value", () => {
        expectEncodeErrors(st.fixedArray(2, st.u16()), [1, -1]);
        expectEncodeErrors(st.fixedArray(2, st.u16()), [2 ** 16 + 1, 0]);
    });
});
