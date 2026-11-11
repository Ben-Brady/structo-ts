import * as st from "../../index.ts";
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
        const spec = st.object({
            length: length.pointer(st.u32()),
            numbers: st.array(length.deref(), st.u8()),
        });

        expect(spec.size).toBe(undefined);
        assertEncodesAndDecodes(
            spec, //
            { length: 0, numbers: [1, 3, 4] },
            { length: 3, numbers: [1, 3, 4] },
        );
    });

    it("cant create reference to pointer", () => {
        const length = st.createReference<Uint8Array>();
        expect(() => {
            length.pointer(st.bytes(st.u8()));
        }).toThrow();
    });

    it("multiple runs function", () => {
        const v = st.createReference<number>();
        const spec = st.object({
            a: v.pointer(st.u32()),
            b: st.array(v.deref(), st.u8()),
        });

        for (let i = 0; i < 3; i++) {
            assertEncodesAndDecodes(
                spec, //
                { a: NaN, b: [1, 3, 4] },
                { a: 3, b: [1, 3, 4] },
            );
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

        assertEncodesAndDecodes(
            Node,
            {
                size: NaN,
                children: [
                    { size: NaN, children: [] },
                    { size: NaN, children: [{ size: NaN, children: [] }] },
                ],
            },
            {
                size: 2,
                children: [
                    { size: 0, children: [] },
                    { size: 1, children: [{ size: 0, children: [] }] },
                ],
            },
        );
    });

    it("snapshots are correct", () => {
        const v = st.createReference<number>();
        assertMatchesSnapshot(
            st.object({
                a: v.pointer(st.u32()),
                b: st.array(v.deref(), st.u8()),
            }),
            {
                a: 3,
                b: [1, 3, 4],
            },
        );
    });
});
