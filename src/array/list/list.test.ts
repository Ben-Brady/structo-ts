import { describe, it } from "bun:test";
import { expectEncode, encodeSnapshotTest, expectEncodeErrors } from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.list", () => {
    it("encode correctly", () => {
        const spec = st.list(st.u8(), st.u32());
        expectEncode(spec, [1, 2, 3, 4]);
    });

    it("works on empty lists", () => {
        const spec = st.list(st.u8(), st.u32());
        expectEncode(spec, []);
    });

    it("throws error on too large array", () => {
        expectEncodeErrors(
            st.list(st.u8(), st.u32()),
            Array.from({ length: 10000 }, () => 0),
        );
    });

    it("throws error on invalid value", () => {
        expectEncodeErrors(st.list(st.u8(), st.u16()), [-1]);
    });

    it(`matches snapshots`, () => {
        encodeSnapshotTest(
            st.list(st.s32(), st.string(st.u16())), //
            ["foo", "bar", "baz"],
        );
    });
});
