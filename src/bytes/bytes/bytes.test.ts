import { st } from "../../index.ts";
import { describe, expect, it } from "vitest";
const { readWrite, assertEncodesAndDecodes, assertEncodeThrows } = st.createTestingUtils(expect);

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
        const value = new Uint8Array(1024 * 1024 * 2); // 2MB
        value.set([1, 2], 1000);
        value.set([3, 4], 2000);
        value.set([5, 6], 3000);

        const output = readWrite({ serializer: st.bytes(st.u32()), value });
        expect(output.toHex()).toBe(value.toHex());
    });

    it("errors on invalid length", () => {
        assertEncodeThrows({
            serializer: st.bytes(st.u8()), //
            value: new Uint8Array(256),
        });
    });
});
