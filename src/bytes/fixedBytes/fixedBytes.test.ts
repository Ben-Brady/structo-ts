import { st } from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

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
        const size = 1024 * 1024 * 8;
        const data = new Uint8Array(size); // 8MB
        data.set([3, 4], 1000);
        data.set([3, 4], 2000);

        assertEncodesAndDecodes({
            serializer: st.fixedBytes(size),
            value: data,
        });
    });

    it("large data writes work", () => {
        const size = 1024 * 1024 * 8;
        const data = new Uint8Array(size); // 8MB
        data.set([3, 4], 1000);
        data.set([3, 4], 2000);

        assertEncodesAndDecodes({
            serializer: st.object({
                before: st.u8(),
                data: st.fixedBytes(size),
                after: st.u8(),
            }),
            value: { before: 1, data, after: 2 },
        });
    });

    it("errors on invalid length", () => {
        assertEncodeThrows({
            serializer: st.fixedBytes(5),
            value: new Uint8Array([1, 2, 3, 4]),
        });
    });
});
