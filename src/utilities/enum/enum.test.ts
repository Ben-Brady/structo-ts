import { st } from "../../index.ts";
import { describe, expect, it } from "vitest";
const { assertEncodesAndDecodes, assertEncodeThrows } = st.createTestingUtils(expect);

describe("st.enum", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.enum(st.u8(), [0, 1, 2]), //
            value: 1,
        });
        assertEncodesAndDecodes({
            serializer: st.enum(st.string(st.u8()), ["foo", "bar", "woof"]), //
            value: "foo",
        });
    });

    it("invalid union variants error", () => {
        assertEncodeThrows({
            serializer: st.enum(st.u8(), [0, 1, 2]),
            value: 4 as unknown as any,
        });
        assertEncodeThrows({
            serializer: st.enum(st.string(st.u8()), ["A", "B", "C"]),
            value: "D" as unknown as any,
        });
    });

    () => {
        {
            const spec = st.enum(st.u8(), [0, 1, 2]);
            //@ts-expect-error, invalid union variant
            st.write(spec, 4);
        }
    };
});
