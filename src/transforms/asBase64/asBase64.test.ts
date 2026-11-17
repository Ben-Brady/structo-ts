import { st } from "../../index.ts";
import { describe, expect, it } from "vitest";
const { assertEncodesAndDecodes, assertEncodeThrows, assertMatchesSnapshot } =
    st.createTestingUtils(expect);

describe("st.asBase64", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.asBase64(st.fixedBytes(1)), //
            value: "rw==",
        });
        assertEncodesAndDecodes({
            serializer: st.asBase64(st.fixedBytes(2)), //
            value: "rx8=",
        });
        assertEncodesAndDecodes({
            serializer: st.asBase64(st.fixedBytes(3)), //
            value: "rx9K",
        });
    });

    it("invalid character error", () => {
        assertEncodeThrows({
            serializer: st.asBase64(st.fixedBytes(3)), //
            value: "rx9-",
        });
    });

    it("invalid length error", () => {
        assertEncodeThrows({
            serializer: st.asBase64(st.fixedBytes(4)), //
            value: "rx9L",
        });
    });

    it("snapshots", () => {
        assertMatchesSnapshot({
            serializer: st.asBase64(st.fixedBytes(3)), //
            value: "rx9K",
        });
        assertMatchesSnapshot({
            serializer: st.asBase64(st.fixedBytes(6)), //
            value: "fR9KIj8V",
        });
    });
});
