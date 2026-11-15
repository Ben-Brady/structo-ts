import { st } from "../../index.ts";
import { describe, expect, it } from "vitest";
const { assertEncodesAndDecodes, assertEncodeThrows } = st.createTestingUtils(expect);

describe("st.literal", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.literal(st.u8(), 0),
            value: 0,
        });
        assertEncodesAndDecodes({
            serializer: st.literal(st.string(st.u8()), "foo"),
            value: "foo",
        });
    });

    it("invalid literal errors", () => {
        assertEncodeThrows({
            serializer: st.literal(st.u8(), 0),
            value: 2,
        });
        assertEncodeThrows({
            serializer: st.literal(st.string(st.u8()), "A"),
            value: "B",
        });
    });

    () => {
        {
            const spec = st.literal(st.u8(), 0);
            //@ts-expect-error, invalid union variant
            st.write(spec, 1);
        }
        {
            const spec = st.literal(st.string(st.u8()), "foo");
            //@ts-expect-error, invalid literal value
            st.write(spec, "bar");
        }
        //@ts-expect-error, invalid inheritance
        st.literal(st.string(st.u8()), 0);
    };
});
