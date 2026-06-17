import { describe, it } from "bun:test";
import { expectEncode, expectEncodeSnapshot, expectError } from "../utils.test";

import * as st from "../../index";

describe("st.exhuastiveArray", () => {
    it("encode correctly", () => {
        const spec = st.exhuastiveArray(st.u32());
        expectEncode(spec, [1, 2, 3, 4]);
    });

    it("works on empty arrays", () => {
        const spec = st.exhuastiveArray(st.u32());
        expectEncode(spec, []);
    });

    it("accepts large array", () => {
        const spec = st.exhuastiveArray(st.u32());
        expectEncode(
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
        expectEncode(spec, { a: 1, b: 2, c: [3, 4, 5, 6, 7] });
    });

    it("throws error on invalid value", () => {
        const spec = st.exhuastiveArray(st.u16());
        expectError(() => {
            st.write(spec, [-1]);
        });
    });

    it("nested arrays encode correctly", () => {
        expectEncode(
            st.exhuastiveArray(st.exhuastiveArray(st.u16())), //
            [[1, 2]],
        );
    });

    it(`matches snapshots`, () => {
        expectEncodeSnapshot(
            st.exhuastiveArray(st.string(st.u16())), //
            ["foo", "bar", "baz"],
        );
        expectEncodeSnapshot(
            st.exhuastiveArray(st.u8()), //
            [0, 1, 2, 3],
        );
    });
});
