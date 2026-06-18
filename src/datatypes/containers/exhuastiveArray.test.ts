import { describe, it } from "bun:test";
import { encodeTest, encodeSnapshotTest, encodeFailTest } from "../../utils.test";

import * as st from "../../index";

describe("st.exhuastiveArray", () => {
    it("encode correctly", () => {
        const spec = st.exhuastiveArray(st.u32());
        encodeTest(spec, [1, 2, 3, 4]);
    });

    it("works on empty arrays", () => {
        const spec = st.exhuastiveArray(st.u32());
        encodeTest(spec, []);
    });

    it("accepts large array", () => {
        const spec = st.exhuastiveArray(st.u32());
        encodeTest(
            spec,
            Array.from({ length: 10000 }, (_, i) => i),
        );
    });

    it("works composed", () => {
        const spec = st.object({
            a: st.u32(),
            b: st.u8(),
            c: st.exhuastiveArray(st.u32()),
        });
        encodeTest(spec, { a: 1, b: 2, c: [3, 4, 5, 6, 7] });
    });

    it("throws error on invalid value", () => {
        encodeFailTest(st.exhuastiveArray(st.u16()), [-1]);
    });

    it("nested arrays encode correctly", () => {
        encodeTest(
            st.exhuastiveArray(st.exhuastiveArray(st.u16())), //
            [[1, 2]],
        );
    });

    it(`matches snapshots`, () => {
        encodeSnapshotTest(
            st.exhuastiveArray(st.string(st.u16())), //
            ["foo", "bar", "baz"],
        );
        encodeSnapshotTest(
            st.exhuastiveArray(st.u8()), //
            [0, 1, 2, 3],
        );
    });
});
