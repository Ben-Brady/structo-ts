import { describe, it } from "bun:test";
import { expectEncode, encodeSnapshotTest, expectEncodeFail } from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.toAscii", () => {
    it("encode correctly", () => {
        expectEncode(
            st.pipe(st.bytes(5), st.toAscii()), //
            "a6534",
        );
        expectEncode(
            st.pipe(st.bytes(3), st.toAscii()), //
            "-as",
        );
    });

    it("invalid length throws error", () => {
        expectEncodeFail(
            st.pipe(st.bytes(4), st.toAscii()), //
            "asd",
        );
    });

    it("invalid character throws error", () => {
        expectEncodeFail(
            st.pipe(st.bytes(4), st.toAscii()), //
            "asdé",
        );
    });

    it("snapshots", () => {
        encodeSnapshotTest(
            st.pipe(st.bytes(4), st.toAscii()), //
            "634f",
        );
        encodeSnapshotTest(
            st.pipe(st.bytes(6), st.toAscii()), //
            "hdjdp_",
        );
    });
});
