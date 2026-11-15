import { st } from "../../index.ts";
import { describe, expect, it } from "vitest";
const { readWrite, assertEncodesAndDecodes, assertEncodeThrows } = st.createTestingUtils(expect);

describe("st.fixedBytes", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.fixedBytes(2),
            value: new Uint8Array([1, 2]),
        });
    });

    it("encodes empty correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.fixedBytes(0),
            value: new Uint8Array([]),
        });
    });

    it("holds large data", () => {
        const size = 1024 * 1024 * 2;
        const serializer = st.fixedBytes(size);

        const data = new Uint8Array(size); // 2MB
        data.set([3, 4], 1000);
        data.set([3, 4], 2000);
        const outputData = readWrite({ serializer, value: data });
        expect(outputData.toHex()).toBe(data.toHex());
    });

    it("large data writes work", () => {
        const size = 1024 * 1024 * 2;
        const data = new Uint8Array(size); // 2MB
        data.set([3, 4], 1000);
        data.set([3, 4], 2000);

        const serializer = st.object({
            before: st.u8(),
            data: st.fixedBytes(size),
            after: st.u8(),
        });
        const value = { before: 1, data, after: 2 };
        const output = readWrite({ serializer, value });
        expect(output.before).toBe(value.before);
        expect(output.after).toBe(value.after);
        expect(output.data.toHex()).toBe(value.data.toHex());
    });

    it("errors on invalid length", () => {
        assertEncodeThrows({
            serializer: st.fixedBytes(5),
            value: new Uint8Array([1, 2, 3, 4]),
        });
    });
});
