import { describe, it } from "bun:test";
import { expectEncode, encodeSnapshotTest, expectEncodeFail } from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.toBytes", () => {
    it("encode correctly", () => {
        expectEncode(
            st.pipe(st.bytes(3), st.toBytes()), //
            [0, 1, 2],
        );
        expectEncode(
            st.pipe(st.bytes(3), st.toBytes()), //
            [255, 0, 127],
        );
    });

    it("invalid length throws error", () => {
        expectEncodeFail(
            st.pipe(st.bytes(3), st.toBytes()), //
            [0, 1],
        );
    });

    it("invalid values throws error", () => {
        expectEncodeFail(
            st.pipe(st.bytes(3), st.toBytes()), //
            [256, 1, 1],
        );
        expectEncodeFail(
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
