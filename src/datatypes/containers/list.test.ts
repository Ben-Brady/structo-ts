import { describe, it } from "bun:test";
import { encodeTest, encodeSnapshotTest, encodeFailTest } from "../../utils.test.js";

import * as st from "../../index.js";

describe("st.list", () => {
    it("encode correctly", () => {
        const spec = st.list(st.u8(), st.u32());
        encodeTest(spec, [1, 2, 3, 4]);
    });

    it("works on empty lists", () => {
        const spec = st.list(st.u8(), st.u32());
        encodeTest(spec, []);
    });

    it("throws error on too large array", () => {
        encodeFailTest(
            st.list(st.u8(), st.u32()),
            Array.from({ length: 10000 }, () => 0),
        );
    });

    it("throws error on invalid value", () => {
        encodeFailTest(st.list(st.u8(), st.u16()), [-1]);
    });

    it(`matches snapshots`, () => {
        encodeSnapshotTest(
            st.list(st.s32(), st.string(st.u16())), //
            ["foo", "bar", "baz"],
        );
    });
});
