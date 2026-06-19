import { describe, it } from "bun:test";
import { encodeTest, encodeSnapshotTest, encodeFailTest } from "../utils.test.js";

import * as st from "../index.js";

describe("st.toBase64", () => {
    it("encode correctly", () => {
        encodeTest(
            st.pipe(st.bytes(1), st.toBase64()), //
            "rw==",
        );
        encodeTest(
            st.pipe(st.bytes(2), st.toBase64()), //
            "rx8=",
        );
        encodeTest(
            st.pipe(st.bytes(3), st.toBase64()), //
            "rx9K",
        );
    });

    it("invalid character error", () => {
        encodeFailTest(
            st.pipe(st.bytes(3), st.toBase64()), //
            "rx9-",
        );
    });

    it("invalid length error", () => {
        encodeFailTest(
            st.pipe(st.bytes(4), st.toBase64()), //
            "rx9L",
        );
    });

    it("snapshots", () => {
        encodeSnapshotTest(
            st.pipe(st.bytes(3), st.toBase64()), //
            "rx9K",
        );
        encodeSnapshotTest(
            st.pipe(st.bytes(6), st.toBase64()), //
            "fR9KIj8V",
        );
    });
});
