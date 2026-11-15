import { st } from "../../index.ts";
import { describe, expect, it } from "vitest";
const { assertEncodesAndDecodes, assertEncodeThrows, assertMatchesSnapshot } =
    st.createTestingUtils(expect);

describe("st.toAscii", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.asAscii(st.fixedBytes(5)), //
            value: "a6534",
        });
        assertEncodesAndDecodes({
            serializer: st.asAscii(st.fixedBytes(3)), //
            value: "-as",
        });
    });

    it("invalid length throws error", () => {
        assertEncodeThrows({
            serializer: st.asAscii(st.fixedBytes(4)), //
            value: "asd",
        });
    });

    it("invalid character throws error", () => {
        assertEncodeThrows({
            serializer: st.asAscii(st.fixedBytes(4)), //
            value: "asdé",
        });
    });

    it("snapshots", () => {
        assertMatchesSnapshot({
            serializer: st.asAscii(st.fixedBytes(4)), //
            value: "634f",
        });
        assertMatchesSnapshot({
            serializer: st.asAscii(st.fixedBytes(6)), //
            value: "hdjdp_",
        });
    });
});
