import * as st from "../../index.ts";
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
        assertEncodesAndDecodes(
            st.pipe(st.fixedBytes(5), st.toAscii()), //
            "a6534",
        );
        assertEncodesAndDecodes(
            st.pipe(st.fixedBytes(3), st.toAscii()), //
            "-as",
        );
    });

    it("invalid length throws error", () => {
        assertEncodeThrows(
            st.pipe(st.fixedBytes(4), st.toAscii()), //
            "asd",
        );
    });

    it("invalid character throws error", () => {
        assertEncodeThrows(
            st.pipe(st.fixedBytes(4), st.toAscii()), //
            "asdé",
        );
    });

    it("snapshots", () => {
        assertMatchesSnapshot(
            st.pipe(st.fixedBytes(4), st.toAscii()), //
            "634f",
        );
        assertMatchesSnapshot(
            st.pipe(st.fixedBytes(6), st.toAscii()), //
            "hdjdp_",
        );
    });
});
