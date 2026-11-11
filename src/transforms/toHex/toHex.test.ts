import * as st from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.toHex", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.pipe(st.fixedBytes(3), st.toHex()), //
            value: "FFAB01",
        });
    });

    it("invalid digits error", () => {
        assertEncodeThrows({
            serializer: st.pipe(st.fixedBytes(3), st.toHex()), //
            value: "00000G",
        });
    });

    it("invalid length error", () => {
        assertEncodeThrows({
            serializer: st.pipe(st.fixedBytes(3), st.toHex()), //
            value: "0000",
        });
    });

    it("snapshots", () => {
        assertMatchesSnapshot({
            serializer: st.pipe(st.fixedBytes(3), st.toHex()), //
            value: "FFAB01",
        });
        assertMatchesSnapshot({
            serializer: st.pipe(st.fixedBytes(5), st.toHex()), //
            value: "0000000000",
        });
    });
});
