import { describe, it } from "bun:test";
import { expectEncode, expectError } from "../utils.test";

import * as st from "../../index";

describe("st.array", () => {
    it("encode correctly", () => {
        const spec = st.array(4, st.u16());
        expectEncode(spec, [1, 2, 3, 4]);
    });

    it("works on empty lists", () => {
        const spec = st.array(0, st.u16());
        expectEncode(spec, []);
    });

    it("throws error on invalid size", () => {
        const spec = st.array(2, st.u16());
        expectError(() => st.write(spec, [1]));
    });

    it("throws error on invalid value", () => {
        const spec = st.array(2, st.u16());
        expectError(() => st.write(spec, [1, -1]));
        expectError(() => st.write(spec, [2 ** 16 + 1, 0]));
    });
});
