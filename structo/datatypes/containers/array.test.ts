import { describe, it, expect } from "bun:test";
import { expectEncode, expectError, randint } from "../utils.test";

import * as st from "../../index";

describe("st.array", () => {
    it("encode correctly", () => {
        const spec = st.array({ type: st.u16(), size: 4 });
        expectEncode(spec, [1, 2, 3, 4]);
    });

    it("works on empty lists", () => {
        const spec = st.array({ type: st.u16(), size: 0 });
        expectEncode(spec, []);
    });

    it("throws error on invalid size", () => {
        const spec = st.array({ type: st.u16(), size: 2 });
        expectError(() => st.write(spec, [1]));
    });

    it("throws error on invalid value", () => {
        const spec = st.array({ type: st.u16(), size: 2 });
        expectError(() => st.write(spec, [1, -1]));
        expectError(() => st.write(spec, [2 ** 16 + 1, 0]));
    });
});
