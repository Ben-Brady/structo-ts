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
        assertEncodesAndDecodes(
            st.pipe(st.fixedBytes(3), st.toHex()), //
            "FFAB01",
        );
    });

    it("invalid digits error", () => {
        assertEncodeThrows(
            st.pipe(st.fixedBytes(3), st.toHex()), //
            "00000G",
        );
    });

    it("invalid length error", () => {
        assertEncodeThrows(
            st.pipe(st.fixedBytes(3), st.toHex()), //
            "0000",
        );
    });

    it("snapshots", () => {
        assertMatchesSnapshot(
            st.pipe(st.fixedBytes(3), st.toHex()), //
            "FFAB01",
        );
        assertMatchesSnapshot(
            st.pipe(st.fixedBytes(5), st.toHex()), //
            "0000000000",
        );
    });
});
