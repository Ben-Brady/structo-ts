import { describe, it } from "bun:test";
import { expectEncode, expectEncodeErrors } from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.array", () => {
    it("encode correctly", () => {
        expectEncode(st.array(4, st.u16()), [1, 2, 3, 4]);
    });

    it("works on empty lists", () => {
        expectEncode(st.array(0, st.u16()), []);
    });

    it("throws error on invalid size", () => {
        expectEncodeErrors(st.array(2, st.u16()), [1]);
    });

    it("throws error on invalid value", () => {
        expectEncodeErrors(st.array(2, st.u16()), [1, -1]);
        expectEncodeErrors(st.array(2, st.u16()), [2 ** 16 + 1, 0]);
    });
});
