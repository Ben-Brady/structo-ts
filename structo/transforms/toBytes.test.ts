import { describe, it } from "bun:test";
import { encodeTest, encodeSnapshotTest, encodeFailTest } from "../datatypes/utils.test";

import * as st from "../index";

describe("st.toBytes", () => {
    it("encode correctly", () => {
        encodeTest(
            st.pipe(st.bytes(3), st.toBytes()), //
            [0, 1, 2],
        );
        encodeTest(
            st.pipe(st.bytes(3), st.toBytes()), //
            [255, 0, 127],
        );
    });

    it("invalid length throws error", () => {
        encodeFailTest(
            st.pipe(st.bytes(3), st.toBytes()), //
            [0, 1],
        );
    });

    it("invalid values throws error", () => {
        encodeFailTest(
            st.pipe(st.bytes(3), st.toBytes()), //
            [256, 1, 1],
        );
        encodeFailTest(
            st.pipe(st.bytes(3), st.toBytes()), //
            [-1, 1, 1],
        );
    });

    it("snapshots", () => {
        encodeSnapshotTest(
            st.pipe(st.bytes(3), st.toBytes()), //
            [73, 12, 3],
        );
        encodeSnapshotTest(
            st.pipe(st.bytes(6), st.toBytes()), //
            [34, 10, 0, 74, 31, 23],
        );
    });
});
