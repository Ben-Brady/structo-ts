import * as st from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.enum", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes(
            st.pipe(st.u8(), st.enum([0, 1, 2])), //
            1,
        );
        assertEncodesAndDecodes(
            st.pipe(st.string(st.u8()), st.enum(["foo", "bar", "woof"])), //
            "foo",
        );
    });
    it("invalid union variants error", () => {
        //@ts-expect-error
        assertEncodeThrows(st.pipe(st.u8(), st.enum([0, 1, 2])), 4);
        //@ts-expect-error
        assertEncodeThrows(st.pipe(st.string(st.u8()), st.enum(["A", "B", "C"])), "D");
    });

    () => {
        //@ts-expect-error, invalid union variant
        st.write(st.pipe(st.u8(), st.enum([0, 1, 2])), 4);
    };
});
