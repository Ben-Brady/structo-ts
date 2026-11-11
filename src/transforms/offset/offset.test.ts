import { st } from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.offset(relative)", () => {
    it("encodes correctly with fixed offset", () => {
        assertEncodesAndDecodes({
            serializer: st.object({
                foo: st.u32(),
                bar: st.pipe(
                    st.u32(),
                    st.offset("relative", -4), //
                ),
            }),
            value: { foo: 1, bar: 5 },
            expected: { foo: 5, bar: 5 }, //
        });
    });

    it("encodes correctly with read offset", () => {
        const offset = st.createRememberedValue<number>();
        assertEncodesAndDecodes({
            serializer: st.object({
                foo: st.u32(),
                offset: offset.save(st.s16()),
                bar: st.pipe(
                    st.u32(),
                    st.offset("relative", offset.load()), //
                ),
            }),
            value: { foo: 0, offset: -6, bar: 5 },
            expected: { foo: 5, offset: -6, bar: 5 }, //
        });
    });
});

describe("st.offset(absolute)", () => {
    it("encodes correctly with fixed offset", () => {
        assertEncodesAndDecodes({
            serializer: st.object({
                foo: st.u32(),
                bar: st.pipe(
                    st.u32(),
                    st.offset("absolute", 0), //
                ),
            }),
            value: { foo: 0, bar: 5 },
            expected: { foo: 5, bar: 5 }, //
        });
    });

    it("encodes correctly with read offset", () => {
        const offset = st.createRememberedValue<number>();
        assertEncodesAndDecodes({
            serializer: st.object({
                foo: st.u32(),
                offset: offset.save(st.u32()),
                bar: st.pipe(
                    st.u32(),
                    st.offset("absolute", offset.load()), //
                ),
            }),
            value: { foo: 0, offset: 0, bar: 5 },
            expected: { foo: 5, offset: 0, bar: 5 }, //
        });
    });
});
