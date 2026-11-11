import { st } from "../../index.ts";
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
        assertEncodesAndDecodes({
            serializer: st.pipe(st.u8(), st.literal(0)),
            value: 0,
        });
        assertEncodesAndDecodes({
            serializer: st.pipe(st.string(st.u8()), st.literal("foo")),
            value: "foo",
        });
    });

    it("invalid literal errors", () => {
        assertEncodeThrows({
            serializer: st.pipe(st.u8(), st.literal(0)),
            value: 2,
        });
        assertEncodeThrows({
            serializer: st.pipe(st.string(st.u8()), st.literal("A")),
            value: "B",
        });
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
