import { describe, it } from "bun:test";
import { expectEncode, encodeSnapshotTest, expectEncodeErrors } from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.toAscii", () => {
    it("encode correctly", () => {
        expectEncode(
            st.pipe(st.fixedBytes(5), st.toAscii()), //
            "a6534",
        );
        expectEncode(
            st.pipe(st.fixedBytes(3), st.toAscii()), //
            "-as",
        );
    });

    it("invalid length throws error", () => {
        expectEncodeErrors(
            st.pipe(st.fixedBytes(4), st.toAscii()), //
            "asd",
        );
    });

    it("invalid character throws error", () => {
        expectEncodeErrors(
            st.pipe(st.fixedBytes(4), st.toAscii()), //
            "asdé",
        );
    });

    it("snapshots", () => {
        encodeSnapshotTest(
            st.pipe(st.fixedBytes(4), st.toAscii()), //
            "634f",
        );
        encodeSnapshotTest(
            st.pipe(st.fixedBytes(6), st.toAscii()), //
            "hdjdp_",
        );
    });
});
