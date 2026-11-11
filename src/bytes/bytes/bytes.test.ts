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
        assertEncodesAndDecodes({
            serializer: st.bytes(st.u8()),
            value: new Uint8Array([1, 2]),
        });
    });

    it("encodes empty correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.bytes(st.u8()),
            value: new Uint8Array([]),
        });
    });

    it("holds large data", () => {
        const value = new Uint8Array(1024 * 1024 * 8); // 8MB
        value.set([1, 2], 1000);
        value.set([3, 4], 2000);
        value.set([5, 6], 3000);

        assertEncodesAndDecodes({
            serializer: st.bytes(st.u32()),
            value: value,
        });
    });

    it("errors on invalid length", () => {
        assertEncodeThrows({
            serializer: st.bytes(st.u8()), //
            value: new Uint8Array(256),
        });
    });
});
