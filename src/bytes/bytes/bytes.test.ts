import * as st from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.bytes", () => {
    it("encode correctly", () => {
        const buffer = st.bytes(st.u8());
        assertEncodesAndDecodes(buffer, new Uint8Array([1, 2]));
    });

    it("encodes empty correctly", () => {
        const spec = st.bytes(st.u8());
        assertEncodesAndDecodes(spec, new Uint8Array([]));
    });

    it("holds large data", () => {
        const size = 1024 * 1024 * 8; // 8MB
        const spec = st.bytes(st.u32());

        const data = new Uint8Array(size);
        data.set([3, 4], 1000);
        data.set([3, 4], 2000);
        assertEncodesAndDecodes(spec, data);
    });

    it("errors on invalid length", () => {
        assertEncodeThrows(
            st.bytes(st.u8()), //
            new Uint8Array(Array.from({ length: 256 }, () => 0)),
        );
    });
});
