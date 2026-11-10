import { describe, it } from "bun:test";
import { expectEncode, encodeSnapshotTest, expectEncodeErrors } from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.arrayExhaustive", () => {
    it("encode correctly", () => {
        const spec = st.arrayExhaustive(st.u32());
        expectEncode(spec, [1, 2, 3, 4]);
    });

    it("works on empty arrays", () => {
        const spec = st.arrayExhaustive(st.u32());
        expectEncode(spec, []);
    });

    it("accepts large array", () => {
        const spec = st.arrayExhaustive(st.u32());
        expectEncode(
            spec,
            Array.from({ length: 10000 }, (_, i) => i),
        );
    });

    it("works composed", () => {
        const spec = st.object({
            a: st.u32(),
            b: st.u8(),
            c: st.arrayExhaustive(st.u32()),
        });
        expectEncode(spec, { a: 1, b: 2, c: [3, 4, 5, 6, 7] });
    });

    it("throws error on invalid value", () => {
        expectEncodeErrors(st.arrayExhaustive(st.u16()), [-1]);
    });

    it("nested arrays encode correctly", () => {
        expectEncode(
            st.arrayExhaustive(st.arrayExhaustive(st.u16())), //
            [[1, 2]],
        );
    });

    it(`matches snapshots`, () => {
        encodeSnapshotTest(
            st.arrayExhaustive(st.string(st.u16())), //
            ["foo", "bar", "baz"],
        );
        encodeSnapshotTest(
            st.arrayExhaustive(st.u8()), //
            [0, 1, 2, 3],
        );
    });
});
