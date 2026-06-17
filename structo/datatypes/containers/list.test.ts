import { describe, it } from "bun:test";
import { expectEncode, expectEncodeSnapshot, expectError } from "../utils.test";

import * as st from "../../index";

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
        const spec = st.list(st.u8(), st.u32());
        expectError(() => {
            st.write(
                spec,
                Array.from({ length: 10000 }, () => 0),
            );
        });
    });

    it("throws error on invalid value", () => {
        const spec = st.list(st.u8(), st.u16());
        expectError(() => {
            st.write(spec, [-1]);
        });
    });

    it(`matches snapshots`, () => {
        expectEncodeSnapshot(
            st.list(st.s32(), st.string(st.u16())), //
            ["foo", "bar", "baz"],
        );
    });
});
