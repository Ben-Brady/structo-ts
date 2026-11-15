import { st } from "../../index.ts";
import { describe, expect, it } from "vitest";
const { assertEncodesAndDecodes, assertEncodeThrows, assertMatchesSnapshot } =
    st.createTestingUtils(expect);

describe("st.asUtf8", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.asUtf8(st.fixedBytes(5)), //
            value: "a6534",
        });
        assertEncodesAndDecodes({
            serializer: st.asUtf8(st.fixedBytes(3)), //
            value: "-as",
        });
        assertEncodesAndDecodes({
            serializer: st.asUtf8(st.fixedBytes(5)), //
            value: "asdé",
        });
    });

    it("invalid length throws error", () => {
        assertEncodeThrows({
            serializer: st.asUtf8(st.fixedBytes(4)), //
            value: "asd",
        });
    });

    it("snapshots", () => {
        assertMatchesSnapshot({
            serializer: st.asUtf8(st.fixedBytes(4)), //
            value: "634f",
        });
        assertMatchesSnapshot({
            serializer: st.asUtf8(st.fixedBytes(6)), //
            value: "hdjdp_",
        });
        assertEncodesAndDecodes({
            serializer: st.asUtf8(st.fixedBytes(5)), //
            value: "asdé",
        });
    });
});
