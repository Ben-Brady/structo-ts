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
        assertEncodesAndDecodes({
            serializer: st.pipe(st.fixedBytes(1), st.toBase64()), //
            value: "rw==",
        });
        assertEncodesAndDecodes({
            serializer: st.pipe(st.fixedBytes(2), st.toBase64()), //
            value: "rx8=",
        });
        assertEncodesAndDecodes({
            serializer: st.pipe(st.fixedBytes(3), st.toBase64()), //
            value: "rx9K",
        });
    });

    it("invalid character error", () => {
        assertEncodeThrows({
            serializer: st.pipe(st.fixedBytes(3), st.toBase64()), //
            value: "rx9-",
        });
    });

    it("invalid length error", () => {
        assertEncodeThrows({
            serializer: st.pipe(st.fixedBytes(4), st.toBase64()), //
            value: "rx9L",
        });
    });

    it("snapshots", () => {
        assertMatchesSnapshot({
            serializer: st.pipe(st.fixedBytes(3), st.toBase64()), //
            value: "rx9K",
        });
        assertMatchesSnapshot({
            serializer: st.pipe(st.fixedBytes(6), st.toBase64()), //
            value: "fR9KIj8V",
        });
    });
});
