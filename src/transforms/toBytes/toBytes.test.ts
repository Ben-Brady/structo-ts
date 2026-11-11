import * as st from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.toBytes", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes(
            st.pipe(st.fixedBytes(3), st.toBytes()), //
            [0, 1, 2],
        );
        assertEncodesAndDecodes(
            st.pipe(st.fixedBytes(3), st.toBytes()), //
            [255, 0, 127],
        );
    });

    it("invalid length throws error", () => {
        assertEncodeThrows(
            st.pipe(st.fixedBytes(3), st.toBytes()), //
            [0, 1],
        );
    });

    it("invalid values throws error", () => {
        assertEncodeThrows(
            st.pipe(st.fixedBytes(3), st.toBytes()), //
            [256, 1, 1],
        );
        assertEncodeThrows(
            st.pipe(st.fixedBytes(3), st.toBytes()), //
            [-1, 1, 1],
        );
    });

    it("snapshots", () => {
        assertMatchesSnapshot(
            st.pipe(st.fixedBytes(3), st.toBytes()), //
            [73, 12, 3],
        );
        assertMatchesSnapshot(
            st.pipe(st.fixedBytes(6), st.toBytes()), //
            [34, 10, 0, 74, 31, 23],
        );
    });
});
