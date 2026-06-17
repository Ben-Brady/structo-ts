import { describe, it } from "node:test";
import * as st from "../index";
import { encodeTest } from "../datatypes/utils.test";

describe("st.noAdvance", () => {
    it("encode correctly", () => {
        encodeTest(
            st.object({
                length: st.pipe(st.u8(), st.noAdvance()),
                text: st.string(st.u8()),
            }), //
            { length: 3, text: "foo" },
        );
        encodeTest(
            st.object({
                a: st.pipe(st.u16(), st.noAdvance()),
                b: st.f16(),
            }), //
            { a: 0, b: 1 },
            { a: 15360, b: 1 },
        );
    });
});
