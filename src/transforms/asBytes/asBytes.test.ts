import { st } from "../../index.ts";
import { describe, expect, it } from "vitest";
const { assertEncodesAndDecodes, assertEncodeThrows, assertMatchesSnapshot } =
    st.createTestingUtils(expect);

describe("st.toBytes", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.asBytes(st.fixedBytes(3)),
            value: [0, 1, 2],
        });
        assertEncodesAndDecodes({
            serializer: st.asBytes(st.fixedBytes(3)),
            value: [255, 0, 127],
        });
    });

    it("invalid length throws error", () => {
        assertEncodeThrows({
            serializer: st.asBytes(st.fixedBytes(3)), //
            value: [0, 1],
        });
    });

    it("invalid values throws error", () => {
        assertEncodeThrows({
            serializer: st.asBytes(st.fixedBytes(3)), //
            value: [256, 1, 1],
        });
        assertEncodeThrows({
            serializer: st.asBytes(st.fixedBytes(3)),
            value: [-1, 1, 1],
        });
    });

    it("snapshots", () => {
        assertMatchesSnapshot({
            serializer: st.asBytes(st.fixedBytes(3)),
            value: [73, 12, 3],
        });
        assertMatchesSnapshot({
            serializer: st.asBytes(st.fixedBytes(6)), //
            value: [34, 10, 0, 74, 31, 23],
        });
    });
});
