import { describe, it } from "bun:test";
import { encodeTest, encodeSnapshotTest, encodeFailTest } from "../datatypes/utils.test";

import * as st from "../index";

describe("st.toHex", () => {
    it("encode correctly", () => {
        encodeTest(
            st.pipe(st.bytes(3), st.toHex()), //
            "FFAB01",
        );
    });

    it("invalid digits error", () => {
        encodeFailTest(
            st.pipe(st.bytes(3), st.toHex()), //
            "00000G",
        );
    });

    it("invalid length error", () => {
        encodeFailTest(
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
