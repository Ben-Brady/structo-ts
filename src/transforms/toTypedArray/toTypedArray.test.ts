import { st } from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.toTypedArray", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.pipe(
                st.fixedBytes(6), //
                st.toTypedArray(Uint8Array),
            ),
            value: new Uint8Array([1, 2, 3, 4, 5, 6]),
        });
    });

    it("encode different types correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.object({
                padding: st.u64(),
                data: st.pipe(
                    st.fixedBytes(3), //
                    st.toTypedArray(Uint8Array),
                ),
            }),
            value: { padding: 0, data: new Uint8Array([1, 2, 3]) },
        });
        assertEncodesAndDecodes({
            serializer: st.object({
                padding: st.u64(),
                data: st.pipe(
                    st.fixedBytes(5 * 2), //
                    st.toTypedArray(Uint16Array),
                ),
            }),
            value: { padding: 0, data: new Uint16Array([1, 2, 3, 63, 74]) },
        });
        assertEncodesAndDecodes({
            serializer: st.object({
                padding: st.u64(),
                data: st.pipe(
                    st.fixedBytes(3 * 8), //
                    st.toTypedArray(Float64Array),
                ),
            }),
            value: {
                padding: 0,
                data: new Float64Array([Math.random(), Math.random(), Math.random()]),
            },
        });
    });

    it("errors when non-standard size", () => {
        assertEncodeThrows({
            serializer: st.pipe(
                st.fixedBytes(3), //
                st.toTypedArray(Uint16Array),
            ),
            value: new Uint16Array([1, 2]),
        });
    });

    it("snapshot tests", () => {
        assertMatchesSnapshot({
            serializer: st.pipe(
                st.fixedBytes(4 * 2), //
                st.toTypedArray(Uint16Array),
            ),
            value: new Uint16Array([1, 6, 3, 12]),
        });
        assertMatchesSnapshot({
            serializer: st.pipe(
                st.fixedBytes(3 * 8), //
                st.toTypedArray(Float64Array),
            ),
            value: new Float64Array([1.52, 0.3523, 0.152]),
        });
    });
});
