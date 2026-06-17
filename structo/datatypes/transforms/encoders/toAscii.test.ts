import { describe, it } from "bun:test";
import { encodeTest, encodeSnapshotTest, encodeErrorTest } from "../../utils.test";

import * as st from "../../../index";

describe("st.toAscii", () => {
    it("encode correctly", () => {
        encodeTest(
            st.pipe(st.bytes(5), st.toAscii()), //
            "a6534",
        );
        encodeTest(
            st.pipe(st.bytes(3), st.toAscii()), //
            "-as",
        );
    });

    it("invalid length throws error", () => {
        encodeErrorTest(
            st.pipe(st.bytes(4), st.toAscii()), //
            "asd",
        );
    });

    it("invalid character throws error", () => {
        encodeErrorTest(
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
