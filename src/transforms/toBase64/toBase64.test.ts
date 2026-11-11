import * as st from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.toBase64", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes(
            st.pipe(st.fixedBytes(1), st.toBase64()), //
            "rw==",
        );
        assertEncodesAndDecodes(
            st.pipe(st.fixedBytes(2), st.toBase64()), //
            "rx8=",
        );
        assertEncodesAndDecodes(
            st.pipe(st.fixedBytes(3), st.toBase64()), //
            "rx9K",
        );
    });

    it("invalid character error", () => {
        assertEncodeThrows(
            st.pipe(st.fixedBytes(3), st.toBase64()), //
            "rx9-",
        );
    });

    it("invalid length error", () => {
        assertEncodeThrows(
            st.pipe(st.fixedBytes(4), st.toBase64()), //
            "rx9L",
        );
    });

    it("snapshots", () => {
        assertMatchesSnapshot(
            st.pipe(st.fixedBytes(3), st.toBase64()), //
            "rx9K",
        );
        assertMatchesSnapshot(
            st.pipe(st.fixedBytes(6), st.toBase64()), //
            "fR9KIj8V",
        );
    });
});
