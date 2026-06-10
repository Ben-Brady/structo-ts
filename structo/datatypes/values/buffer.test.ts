import { describe, it, expect } from "bun:test";
import { bytes, expectEncode, expectError, randint } from "../utils.test";

import * as st from "../../index";

describe("st.buffer", () => {
    const buffer = st.buffer(2);

    it("encode correctly", () => {
        expectEncode(buffer, bytes([1, 2]));
    });

    it("encodes empty correctly", () => {
        const spec = st.buffer(0);
        expectEncode(spec, bytes([]));
    });

    it("holds large data", () => {
        const size = 1024 * 1024 * 8; // 8MB
        const spec = st.buffer(size);

        const data = new Uint8Array(size);
        data.set([3, 4], 1000);
        data.set([3, 4], 2000);
        expectEncode(spec, data.buffer);
    });
    it("large data writes work", () => {
        const size = 1024 * 1024 * 8; // 8MB
        const spec = st.object({
            before: st.u8(),
            data: st.buffer(size),
            after: st.u8(),
        });

        const data = new Uint8Array(size);
        data.set([3, 4], 1000);
        data.set([3, 4], 2000);
        expectEncode(spec, {
            before: 1,
            data: data.buffer,
            after: 2,
        });
    });

    it("errors on invalid length", () => {
        const spec = st.buffer(5);
        expectError(() => {
            st.write(spec, bytes([1, 2, 3, 4]));
        });
    });
});
