import { describe, it } from "bun:test";
import { bytes, expectEncode } from "../utils.test";

import * as st from "../../index";

describe("st.pipe", () => {
    it("applies correctly", () => {
        const buffer = st.sizedBuffer(st.u8());
        expectEncode(buffer, bytes([1, 2]));
    });

    it("runs in correct order", () => {
        const spec = st.sizedBuffer(st.u8());
        expectEncode(spec, bytes([]));
    });
});
