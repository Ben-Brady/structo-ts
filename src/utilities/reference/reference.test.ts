import { st } from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.createReference", () => {
    it("encodes correctly", () => {
        const length = st.createReference<number>();
        const serializer = st.object({
            length: length.pointer(st.u32()),
            numbers: st.array(length.deref(), st.u8()),
        });

        expect(serializer.size).toBe(undefined);
        assertEncodesAndDecodes({
            serializer,
            value: { length: 0, numbers: [1, 3, 4] },
            expected: { length: 3, numbers: [1, 3, 4] },
        });
    });

    it("cant create reference to pointer", () => {
        const length = st.createReference<Uint8Array>();
        expect(() => {
            length.pointer(st.bytes(st.u8()));
        }).toThrow();
    });

    it("multiple runs function", () => {
        const v = st.createReference<number>();

        for (let i = 0; i < 3; i++) {
            assertEncodesAndDecodes({
                serializer: st.object({
                    a: v.pointer(st.u32()),
                    b: st.array(v.deref(), st.u8()),
                }),
                value: { a: NaN, b: [1, 3, 4] },
                expected: { a: 3, b: [1, 3, 4] },
            });
        }
    });

    it("handles recursive objects", () => {
        const size = st.createReference<number>();
        //@ts-expect-error, recursive types
        const Node = st.lazy(() =>
            st.object({
                size: size.pointer(st.u32()),
                children: st.array(size.deref(), Node),
            }),
        );

        assertEncodesAndDecodes({
            serializer: Node,
            value: {
                size: NaN,
                children: [
                    { size: NaN, children: [] },
                    { size: NaN, children: [{ size: NaN, children: [] }] },
                ],
            },
            expected: {
                size: 2,
                children: [
                    { size: 0, children: [] },
                    { size: 1, children: [{ size: 0, children: [] }] },
                ],
            },
        });
    });

    it("snapshots are correct", () => {
        const v = st.createReference<number>();
        assertMatchesSnapshot({
            serializer: st.object({
                a: v.pointer(st.u32()),
                b: st.array(v.deref(), st.u8()),
            }),
            value: {
                a: 3,
                b: [1, 3, 4],
            },
        });
    });
});
