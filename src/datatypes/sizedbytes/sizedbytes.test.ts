import { describe, it } from "bun:test";
import { bytes, expectEncodeErrors, expectEncode } from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.sizedBytes", () => {
    it("encode correctly", () => {
        const buffer = st.sizedBytes(st.u8());
        expectEncode(buffer, bytes([1, 2]));
    });

    it("encodes empty correctly", () => {
        const spec = st.sizedBytes(st.u8());
        expectEncode(spec, bytes([]));
    });

    it("holds large data", () => {
        const size = 1024 * 1024 * 8; // 8MB
        const spec = st.sizedBytes(st.u32());

        const data = new Uint8Array(size);
        data.set([3, 4], 1000);
        data.set([3, 4], 2000);
        expectEncode(spec, data);
    });

    it("errors on invalid length", () => {
        expectEncodeErrors(
            st.sizedBytes(st.u8()), //
            bytes(Array.from({ length: 256 }, () => 0)),
        );
    });
});
