import { describe, it } from "node:test";
import * as st from "../../index.ts";
import { expectEncode, expectEncodeErrors } from "../../utils.test.ts";

describe("st.literal", () => {
    it("encode correctly", () => {
        expectEncode(st.pipe(st.u8(), st.literal(0)), 0);
        expectEncode(st.pipe(st.string(st.u8()), st.literal("foo")), "foo");
    });

    it("invalid literal errors", () => {
        //@ts-expect-error
        expectEncodeErrors(st.pipe(st.u8(), st.literal(0)), 2);
        //@ts-expect-error
        expectEncodeErrors(st.pipe(st.string(st.u8()), st.literal("A")), "B");
    });

    () => {
        //@ts-expect-error, invalid union variant
        st.write(st.pipe(st.u8(), st.literal(0)), 1);
        //@ts-expect-error, invalid union variant
        st.write(st.pipe(st.u8(), st.literal("foo")), "bar");
        //@ts-expect-error, invalid union variant
        st.write(st.pipe(st.u8(), st.literal("foo")), "bar");
    };
});
