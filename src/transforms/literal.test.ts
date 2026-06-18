import { describe, it } from "node:test";
import * as st from "../index";
import { encodeTest, encodeFailTest } from "../utils.test";

describe("st.literal", () => {
    it("encode correctly", () => {
        encodeTest(
            st.pipe(st.u8(), st.literal(0)), //
            0,
        );
        encodeTest(
            st.pipe(st.string(st.u8()), st.literal("foo")), //
            "foo",
        );
    });

    it("invalid literal errors", () => {
        //@ts-expect-error
        encodeFailTest(st.pipe(st.u8(), st.literal(0)), 2);
        //@ts-expect-error
        encodeFailTest(st.pipe(st.string(st.u8()), st.literal("A")), "B");
    });

    () => {
        //@ts-expect-error, invalid union variant
        st.write(st.pipe(st.u8(), st.literal(0)), 1);
        //@ts-expect-error, invalid union variant
        st.write(st.pipe(st.u8(), st.literal("foo")), "bar");
    };
});
