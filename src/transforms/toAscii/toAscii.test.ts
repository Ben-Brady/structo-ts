import { st } from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.toAscii", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.pipe(st.fixedBytes(5), st.toAscii()), //
            value: "a6534",
        });
        assertEncodesAndDecodes({
            serializer: st.pipe(st.fixedBytes(3), st.toAscii()), //
            value: "-as",
        });
    });

    it("invalid length throws error", () => {
        assertEncodeThrows({
            serializer: st.pipe(st.fixedBytes(4), st.toAscii()), //
            value: "asd",
        });
    });

    it("invalid character throws error", () => {
        assertEncodeThrows({
            serializer: st.pipe(st.fixedBytes(4), st.toAscii()), //
            value: "asdé",
        });
    });

    it("snapshots", () => {
        assertMatchesSnapshot({
            serializer: st.pipe(st.fixedBytes(4), st.toAscii()), //
            value: "634f",
        });
        assertMatchesSnapshot({
            serializer: st.pipe(st.fixedBytes(6), st.toAscii()), //
            value: "hdjdp_",
        });
    });
});
