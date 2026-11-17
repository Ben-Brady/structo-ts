import { st } from "../../index.ts";
import { describe, expect, it } from "vitest";
const { assertEncodesAndDecodes, assertEncodeThrows, assertMatchesSnapshot } =
    st.createTestingUtils(expect);

describe("st.asHex", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.asHex(st.fixedBytes(3)), //
            value: "FFAB01",
        });
    });

    it("invalid digits error", () => {
        assertEncodeThrows({
            serializer: st.asHex(st.fixedBytes(3)), //
            value: "00000G",
        });
    });

    it("invalid length error", () => {
        assertEncodeThrows({
            serializer: st.asHex(st.fixedBytes(3)), //
            value: "0000",
        });
    });

    it("snapshots", () => {
        assertMatchesSnapshot({
            serializer: st.asHex(st.fixedBytes(3)), //
            value: "FFAB01",
        });
        assertMatchesSnapshot({
            serializer: st.asHex(st.fixedBytes(5)), //
            value: "0000000000",
        });
    });
});
