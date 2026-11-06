import { describe, it } from "node:test";
import * as st from "../../index.ts";
import { expectEncode, expectEncodeErrors } from "../../utils.test.ts";

describe("st.enum", () => {
    it("encode correctly", () => {
        expectEncode(
            st.pipe(st.u8(), st.enum([0, 1, 2])), //
            1,
        );
        expectEncode(
            st.pipe(st.string(st.u8()), st.enum(["foo", "bar", "woof"])), //
            "foo",
        );
    });
    it("invalid union variants error", () => {
        //@ts-expect-error
        expectEncodeErrors(st.pipe(st.u8(), st.enum([0, 1, 2])), 4);
        //@ts-expect-error
        expectEncodeErrors(st.pipe(st.string(st.u8()), st.enum(["A", "B", "C"])), "D");
    });

    () => {
        //@ts-expect-error, invalid union variant
        st.write(st.pipe(st.u8(), st.enum([0, 1, 2])), 4);
    };
});
