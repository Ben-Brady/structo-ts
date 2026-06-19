import { describe, expect, it } from "bun:test";
import { encodeTest, encodeSnapshotTest } from "../utils.test";

import * as st from "../index";

describe("st.remember", () => {
    it("encodes correctly", () => {
        const v = st.createRememberedValue<number>();
        const spec = st.object({
            a: v.save(st.u32()),
            b: st.list(v.load(), st.u8()),
        });
        encodeTest(spec, {
            a: 3,
            b: [1, 3, 4],
        });
    });

    it("multiple runs function", () => {
        const v = st.createRememberedValue<number>();
        const spec = st.object({
            a: v.save(st.u32()),
            b: st.list(v.load(), st.u8()),
        });
        encodeTest(spec, { a: 3, b: [1, 3, 4] });
        encodeTest(spec, { a: 3, b: [1, 3, 4] });
        encodeTest(spec, { a: 3, b: [1, 3, 4] });
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
        const spec = st.object({
            a: v.save(st.u32()),
            b: v.load(),
        });
        encodeTest(spec, { a: 3, b: 0 }, { a: 3, b: 3 });
    });

    it("handles recursive objects", () => {
        const size = st.createRememberedValue<number>();
        //@ts-expect-error, recursive types
        const Node = st.lazy(() =>
            st.object({
                size: size.save(st.u32()),
                children: st.list(size.load(), Node),
            }),
        );

        encodeTest(Node, {
            size: 2,
            children: [
                { size: 0, children: [] },
                {
                    size: 1,
                    children: [{ size: 0, children: [] }],
                },
            ],
        });
    });

    it("snapshots are correct", () => {
        const v = st.createRememberedValue<number>();
        encodeSnapshotTest(
            st.object({
                a: v.save(st.u32()),
                b: st.list(v.load(), st.u8()),
            }),
            {
                a: 3,
                b: [1, 3, 4],
            },
        );
    });
});
