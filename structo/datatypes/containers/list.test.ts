import { describe, it } from "bun:test";
import { expectEncode, expectEncodeSnapshot, expectError } from "../utils.test";

import * as st from "../../index";

describe("st.list", () => {
    it("encode correctly", () => {
        const spec = st.list({ type: st.u16(), length: st.u8() });
        expectEncode(spec, [1, 2, 3, 4]);
    });

    it("works on empty lists", () => {
        const spec = st.list({ type: st.u16(), length: st.u8() });
        expectEncode(spec, []);
    });

    it("throws error on too large array", () => {
        const spec = st.list({ type: st.u16(), length: st.u8() });
        expectError(() => {
            st.write(
                spec,
                Array.from({ length: 10000 }, () => 0),
            );
        });
    });

    it("throws error on invalid value", () => {
        const spec = st.list({ type: st.u16(), length: st.u8() });
        expectError(() => {
            st.write(spec, [-1]);
        });
    });

    it(`matches snapshots`, () => {
        expectEncodeSnapshot(
            st.list({
                type: st.string(st.u16()),
                length: st.s32(),
            }),
            ["foo", "bar", "baz"],
        );
    });
});
