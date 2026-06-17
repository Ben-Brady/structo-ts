import { describe, expectTypeOf, it } from "bun:test";
import { encodeTest, expectEncodeSize, encodeSnapshotTest, encodeFailTest } from "../utils.test";

import * as st from "../../index";

describe("st.taggedUnion", () => {
    it("encode correctly", () => {
        const spec = st.taggedUnion(st.u8(), {
            1: st.string(st.u8()),
            2: st.u8(),
        });
        encodeTest(spec, { type: 1, value: "s" });
        encodeTest(spec, { type: 2, value: 52 });
    });

    it("encode with string tag", () => {
        const spec = st.taggedUnion(st.string(st.u8()), {
            foo: st.string(st.u8()),
            bar: st.u8(),
        });
        encodeTest(spec, { type: "foo", value: "woof" });
        encodeTest(spec, { type: "bar", value: 52 });
    });

    it("throws error on invalid tag", () => {
        const spec = st.taggedUnion(st.string(st.u8()), {
            foo: st.string(st.u8()),
            bar: st.u8(),
        });
        //@ts-expect-error, intended
        encodeFailTest(spec, { type: "unknown", value: "woof" });
    });

    it("throws error on invalid type", () => {
        const spec = st.taggedUnion(st.string(st.u8()), {
            foo: st.string(st.u8()),
            bar: st.u8(),
        });
        //@ts-expect-error, intended
        encodeFailTest(spec, { type: "unknown", value: "woof" });
    });

    it("throws error on invalid value", () => {
        const spec = st.taggedUnion(st.string(st.u8()), {
            foo: st.string(st.u8()),
        });
        //@ts-expect-error, intended
        encodeFailTest(spec, { type: "foo", value: 0 });
    });

    it("encodes varying sizes", () => {
        type spec = st.InferOutput<typeof spec>["value"];
        const spec = st.taggedUnion(st.u8(), {
            1: st.string(st.u8()),
            2: st.u8(),
        });
        encodeTest(spec, { type: 1, value: "s" });
        expectEncodeSize(spec, 5, { type: 1, value: "foo" });
        expectEncodeSize(spec, 2, { type: 2, value: 52 });
    });

    it("encodes snapshots", () => {
        encodeSnapshotTest(
            st.taggedUnion(st.u32(), {
                0: st.list(st.u8(), st.f64()),
                3: st.u32(),
            }),
            { type: 0, value: [1] },
        );
    });

    expectTypeOf(
        st.taggedUnion(st.u32(), {
            0: st.u8(),
            1: st.string(st.u32()),
        } as const),
    ).toEqualTypeOf<
        st.Serializer<
            | {
                  type: 0;
                  value: number;
              }
            | {
                  type: 1;
                  value: string;
              }
        >
    >();

    () => {
        //@ts-expect-error, must be same type as tags
        st.taggedUnion(st.string(st.u8()), { 0: st.u8(), 1: st.string(st.u32()) } as const);
    };
});
