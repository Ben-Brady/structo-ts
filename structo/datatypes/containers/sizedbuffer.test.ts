import { describe, it } from "bun:test";
import { bytes, expectEncode, expectError } from "../utils.test";

import * as st from "../../index";

describe("st.buffer", () => {
    it("encode correctly", () => {
        const buffer = st.sizedBuffer(st.u8());
        expectEncode(buffer, bytes([1, 2]));
    });

    it("encodes empty correctly", () => {
        const spec = st.sizedBuffer(st.u8());
        expectEncode(spec, bytes([]));
    });

    it("holds large data", () => {
        const size = 1024 * 1024 * 8; // 8MB
        const spec = st.sizedBuffer(st.u32());

        const data = new Uint8Array(size);
        data.set([3, 4], 1000);
        data.set([3, 4], 2000);
        expectEncode(spec, data.buffer);
    });

    it("errors on invalid length", () => {
        const spec = st.sizedBuffer(st.u8());
        expectError(() => {
            st.write(spec, bytes(Array.from({ length: 256 }, () => 0)));
        });
    });
});
