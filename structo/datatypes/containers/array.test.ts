import { describe, it } from "bun:test";
import { encodeTest, encodeFailTest } from "../utils.test";

import * as st from "../../index";

describe("st.array", () => {
    it("encode correctly", () => {
        encodeTest(st.array(4, st.u16()), [1, 2, 3, 4]);
    });

    it("works on empty lists", () => {
        encodeTest(st.array(0, st.u16()), []);
    });

    it("throws error on invalid size", () => {
        encodeFailTest(st.array(2, st.u16()), [1]);
    });

    it("throws error on invalid value", () => {
        encodeFailTest(st.array(2, st.u16()), [1, -1]);
        encodeFailTest(st.array(2, st.u16()), [2 ** 16 + 1, 0]);
    });
});
