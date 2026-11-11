import * as st from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.fixedBytes", () => {
    const buffer = st.fixedBytes(2);

    it("encode correctly", () => {
        assertEncodesAndDecodes(buffer, new Uint8Array([1, 2]));
    });

    it("encodes empty correctly", () => {
        const spec = st.fixedBytes(0);
        assertEncodesAndDecodes(spec, new Uint8Array([]));
    });

    it("holds large data", () => {
        const size = 1024 * 1024 * 8; // 8MB
        const spec = st.fixedBytes(size);

        const data = new Uint8Array(size);
        data.set([3, 4], 1000);
        data.set([3, 4], 2000);
        assertEncodesAndDecodes(spec, data);
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
        assertEncodesAndDecodes(spec, {
            before: 1,
            data,
            after: 2,
        });
    });

    it("errors on invalid length", () => {
        const spec = st.fixedBytes(5);
        assertEncodeThrows(spec, new Uint8Array([1, 2, 3, 4]));
    });
});
