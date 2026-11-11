import * as st from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.literal", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes(st.pipe(st.u8(), st.literal(0)), 0);
        assertEncodesAndDecodes(st.pipe(st.string(st.u8()), st.literal("foo")), "foo");
    });

    it("invalid literal errors", () => {
        //@ts-expect-error
        assertEncodeThrows(st.pipe(st.u8(), st.literal(0)), 2);
        //@ts-expect-error
        assertEncodeThrows(st.pipe(st.string(st.u8()), st.literal("A")), "B");
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
