import { describe, expect, it } from "bun:test";
import { encodeTest, encodeSnapshotTest } from "../utils.test";

import * as st from "../index";

describe("st.remember", () => {
    const v = st.createRememberedValue<number>();

    it("encodes correctly", () => {
        const spec = st.object({
            a: v.save(st.u32()),
            b: st.list(v.load(), st.u8()),
        });
        encodeTest(spec, {
            a: 3,
            b: [1, 3, 4],
        });
    });

    it("omitted serializer doesn't write data ", () => {
        const spec = st.object({
            a: v.save(st.u32()),
            b: v.load(),
        });
        const output = st.write(spec, { a: 3, b: 0 });
        expect(output.byteLength).toBe(4);
    });

    it("serializer is used write data ", () => {
        const spec = st.object({
            a: v.save(st.u32()),
            b: v.load(st.u8()),
        });
        encodeTest(spec, { a: 3, b: 0 }, { a: 3, b: 3 });
    });

    it("snapshots are correct", () => {
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
        encodeSnapshotTest(
            st.object({
                a: v.save(st.u32()),
                b: v.load(st.u8()),
            }),
            { a: 3, b: 0 },
        );
    });
});
