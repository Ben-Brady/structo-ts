import { describe, it } from "bun:test";
import { expectEncode, encodeSnapshotTest, expectEncodeFail } from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.toHex", () => {
    it("encode correctly", () => {
        expectEncode(
            st.pipe(st.bytes(3), st.toHex()), //
            "FFAB01",
        );
    });

    it("invalid digits error", () => {
        expectEncodeFail(
            st.pipe(st.bytes(3), st.toHex()), //
            "00000G",
        );
    });

    it("invalid length error", () => {
        expectEncodeFail(
            st.pipe(st.bytes(3), st.toHex()), //
            "0000",
        );
    });

    it("snapshots", () => {
        encodeSnapshotTest(
            st.pipe(st.bytes(3), st.toHex()), //
            "FFAB01",
        );
        encodeSnapshotTest(
            st.pipe(st.bytes(5), st.toHex()), //
            "0000000000",
        );
    });
});
