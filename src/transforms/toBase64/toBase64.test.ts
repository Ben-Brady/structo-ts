import { describe, it } from "bun:test";
import { expectEncode, encodeSnapshotTest, expectEncodeErrors } from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.toBase64", () => {
    it("encode correctly", () => {
        expectEncode(
            st.pipe(st.fixedBytes(1), st.toBase64()), //
            "rw==",
        );
        expectEncode(
            st.pipe(st.fixedBytes(2), st.toBase64()), //
            "rx8=",
        );
        expectEncode(
            st.pipe(st.fixedBytes(3), st.toBase64()), //
            "rx9K",
        );
    });

    it("invalid character error", () => {
        expectEncodeErrors(
            st.pipe(st.fixedBytes(3), st.toBase64()), //
            "rx9-",
        );
    });

    it("invalid length error", () => {
        expectEncodeErrors(
            st.pipe(st.fixedBytes(4), st.toBase64()), //
            "rx9L",
        );
    });

    it("snapshots", () => {
        encodeSnapshotTest(
            st.pipe(st.fixedBytes(3), st.toBase64()), //
            "rx9K",
        );
        encodeSnapshotTest(
            st.pipe(st.fixedBytes(6), st.toBase64()), //
            "fR9KIj8V",
        );
    });
});
