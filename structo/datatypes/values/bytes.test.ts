import { describe, it } from "bun:test";
import { bytes, encodeFailTest, encodeTest, expectError } from "../utils.test";

import * as st from "../../index";

describe("st.bytes", () => {
    const buffer = st.bytes(2);

    it("encode correctly", () => {
        encodeTest(buffer, bytes([1, 2]));
    });

    it("encodes empty correctly", () => {
        const spec = st.bytes(0);
        encodeTest(spec, bytes([]));
    });

    it("holds large data", () => {
        const size = 1024 * 1024 * 8; // 8MB
        const spec = st.bytes(size);

        const data = new Uint8Array(size);
        data.set([3, 4], 1000);
        data.set([3, 4], 2000);
        encodeTest(spec, data.buffer);
    });

    it("large data writes work", () => {
        const size = 1024 * 1024 * 8; // 8MB
        const spec = st.object({
            before: st.u8(),
            data: st.bytes(size),
            after: st.u8(),
        });

        const data = new Uint8Array(size);
        data.set([3, 4], 1000);
        data.set([3, 4], 2000);
        encodeTest(spec, {
            before: 1,
            data: data.buffer,
            after: 2,
        });
    });

    it("errors on invalid length", () => {
        const spec = st.bytes(5);
        encodeFailTest(spec, bytes([1, 2, 3, 4]));
    });
});
