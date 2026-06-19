import { describe, it } from "bun:test";
import { bytes, encodeFailTest, encodeTest } from "../../utils.test.js";

import * as st from "../../index.js";

describe("st.sizedBytes", () => {
    it("encode correctly", () => {
        const buffer = st.sizedBytes(st.u8());
        encodeTest(buffer, bytes([1, 2]));
    });

    it("encodes empty correctly", () => {
        const spec = st.sizedBytes(st.u8());
        encodeTest(spec, bytes([]));
    });

    it("holds large data", () => {
        const size = 1024 * 1024 * 8; // 8MB
        const spec = st.sizedBytes(st.u32());

        const data = new Uint8Array(size);
        data.set([3, 4], 1000);
        data.set([3, 4], 2000);
        encodeTest(spec, data.buffer);
    });

    it("errors on invalid length", () => {
        encodeFailTest(
            st.sizedBytes(st.u8()), //
            bytes(Array.from({ length: 256 }, () => 0)),
        );
    });
});
