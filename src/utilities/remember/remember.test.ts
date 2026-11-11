import { describe, expect, it } from "bun:test";
import * as st from "../../index.ts";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.remember", () => {
    it("encodes correctly", () => {
        const v = st.createRememberedValue<number>();
        const serializer = st.object({
            a: v.save(st.u32()),
            b: st.array(v.load(), st.u8()),
        });
        assertEncodesAndDecodes({
            serializer,
            value: {
                a: 3,
                b: [1, 3, 4],
            },
        });
    });

    it("multiple runs function", () => {
        const v = st.createRememberedValue<number>();
        const serializer = st.object({
            a: v.save(st.u32()),
            b: st.array(v.load(), st.u8()),
        });
        assertEncodesAndDecodes({ serializer, value: { a: 3, b: [1, 3, 4] } });
        assertEncodesAndDecodes({ serializer, value: { a: 3, b: [1, 3, 4] } });
        assertEncodesAndDecodes({ serializer, value: { a: 3, b: [1, 3, 4] } });
    });

    it("omitted serializer doesn't write data ", () => {
        const v = st.createRememberedValue<number>();
        const spec = st.object({
            a: v.save(st.u32()),
            b: v.load(),
        });
        const output = st.write(spec, { a: 3, b: 0 });
        expect(spec.size).toBe(4);
        expect(output.byteLength).toBe(4);
    });

    it("serializer is used write data ", () => {
        const v = st.createRememberedValue<number>();
        assertEncodesAndDecodes({
            serializer: st.object({
                a: v.save(st.u32()),
                b: v.load(),
            }),
            value: { a: 3, b: 0 },
            expected: { a: 3, b: 3 },
        });
    });

    it("handles recursive objects", () => {
        const size = st.createRememberedValue<number>();
        //@ts-expect-error, recursive types
        const Node = st.lazy(() =>
            st.object({
                size: size.save(st.u32()),
                children: st.array(size.load(), Node),
            }),
        );

        assertEncodesAndDecodes({
            serializer: Node,
            value: {
                size: 2,
                children: [
                    { size: 0, children: [] },
                    {
                        size: 1,
                        children: [{ size: 0, children: [] }],
                    },
                ],
            },
        });
    });

    it("snapshots are correct", () => {
        const v = st.createRememberedValue<number>();
        assertMatchesSnapshot({
            serializer: st.object({
                a: v.save(st.u32()),
                b: st.array(v.load(), st.u8()),
            }),
            value: {
                a: 3,
                b: [1, 3, 4],
            },
        });
    });
});
