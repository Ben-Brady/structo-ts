import { describe, expect, it } from "bun:test";
import { encodeTest, encodeSnapshotTest, expectError } from "../utils.test.js";

import * as st from "../index.js";

describe("st.createReference", () => {
    it("encodes correctly", () => {
        const length = st.createReference<number>();
        const spec = st.object({
            length: length.pointer(st.u32()),
            numbers: st.list(length.deref(), st.u8()),
        });

        expect(spec.size).toBe(undefined);
        encodeTest(
            spec, //
            { length: 0, numbers: [1, 3, 4] },
            { length: 3, numbers: [1, 3, 4] },
        );
    });

    it("cant create reference to pointer", () => {
        const length = st.createReference<ArrayBuffer>();
        expectError(() => {
            length.pointer(st.sizedBytes(st.u8()));
        });
    });

    it("multiple runs function", () => {
        const v = st.createReference<number>();
        const spec = st.object({
            a: v.pointer(st.u32()),
            b: st.list(v.deref(), st.u8()),
        });

        for (let i = 0; i < 3; i++) {
            encodeTest(
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
                children: st.list(size.deref(), Node),
            }),
        );

        encodeTest(
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
        encodeSnapshotTest(
            st.object({
                a: v.pointer(st.u32()),
                b: st.list(v.deref(), st.u8()),
            }),
            {
                a: 3,
                b: [1, 3, 4],
            },
        );
    });
});
