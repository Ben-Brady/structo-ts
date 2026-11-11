import { st } from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.arrayExhaustive", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.exhuastiveArray(st.u32()),
            value: [1, 2, 3, 4],
        });
    });

    it("works on empty arrays", () => {
        assertEncodesAndDecodes({
            serializer: st.exhuastiveArray(st.u32()),
            value: [],
        });
    });

    it("accepts large array", () => {
        assertEncodesAndDecodes({
            serializer: st.exhuastiveArray(st.u32()),
            value: Array.from({ length: 10000 }, (_, i) => i),
        });
    });

    it("works composed", () => {
        assertEncodesAndDecodes({
            serializer: st.object({
                a: st.u32(),
                b: st.u8(),
                c: st.exhuastiveArray(st.u32()),
            }),
            value: { a: 1, b: 2, c: [3, 4, 5, 6, 7] },
        });
    });

    it("throws error on invalid value", () => {
        assertEncodeThrows({
            serializer: st.exhuastiveArray(st.u16()),
            value: [-1],
        });
    });

    it("nested arrays encode correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.exhuastiveArray(st.exhuastiveArray(st.u16())), //
            value: [[1, 2]],
        });
    });

    it(`matches snapshots`, () => {
        assertMatchesSnapshot({
            serializer: st.exhuastiveArray(st.string(st.u16())), //
            value: ["foo", "bar", "baz"],
        });
        assertMatchesSnapshot({
            serializer: st.exhuastiveArray(st.u8()), //
            value: [0, 1, 2, 3],
        });
    });
});
