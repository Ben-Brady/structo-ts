import { st } from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.toBytes", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.pipe(st.fixedBytes(3), st.toBytes()),
            value: [0, 1, 2],
        });
        assertEncodesAndDecodes({
            serializer: st.pipe(st.fixedBytes(3), st.toBytes()),
            value: [255, 0, 127],
        });
    });

    it("invalid length throws error", () => {
        assertEncodeThrows({
            serializer: st.pipe(st.fixedBytes(3), st.toBytes()), //
            value: [0, 1],
        });
    });

    it("invalid values throws error", () => {
        assertEncodeThrows({
            serializer: st.pipe(st.fixedBytes(3), st.toBytes()), //
            value: [256, 1, 1],
        });
        assertEncodeThrows({
            serializer: st.pipe(st.fixedBytes(3), st.toBytes()),
            value: [-1, 1, 1],
        });
    });

    it("snapshots", () => {
        assertMatchesSnapshot({
            serializer: st.pipe(st.fixedBytes(3), st.toBytes()),
            value: [73, 12, 3],
        });
        assertMatchesSnapshot({
            serializer: st.pipe(st.fixedBytes(6), st.toBytes()), //
            value: [34, 10, 0, 74, 31, 23],
        });
    });
});
