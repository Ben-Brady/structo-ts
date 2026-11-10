import { describe, it } from "bun:test";
import { bytes, expectEncodeErrors, expectEncode } from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.bytesFixed", () => {
    const buffer = st.fixedBytes(2);

    it("encode correctly", () => {
        expectEncode(buffer, bytes([1, 2]));
    });

    it("encodes empty correctly", () => {
        const spec = st.fixedBytes(0);
        expectEncode(spec, bytes([]));
    });

    it("holds large data", () => {
        const size = 1024 * 1024 * 8; // 8MB
        const spec = st.fixedBytes(size);

        const data = new Uint8Array(size);
        data.set([3, 4], 1000);
        data.set([3, 4], 2000);
        expectEncode(spec, data);
    });

    it("large data writes work", () => {
        const size = 1024 * 1024 * 8; // 8MB
        const spec = st.object({
            before: st.u8(),
            data: st.fixedBytes(size),
            after: st.u8(),
        });

        const data = new Uint8Array(size);
        data.set([3, 4], 1000);
        data.set([3, 4], 2000);
        expectEncode(spec, {
            before: 1,
            data,
            after: 2,
        });
    });

    it("errors on invalid length", () => {
        const spec = st.fixedBytes(5);
        expectEncodeErrors(spec, bytes([1, 2, 3, 4]));
    });
});
