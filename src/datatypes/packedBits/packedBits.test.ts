import { describe, it, expectTypeOf } from "bun:test";
import { expectEncode, encodeSnapshotTest, expectEncodedAs } from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.packedBits", () => {
    it("encodes correctly", () => {
        expectEncode(
            st.packedBits({
                a: { bits: 3 },
                b: { bits: 5 },
            }), //
            { b: 2, a: 1 },
        );
    });

    it("handles not saturating bits", () => {
        expectEncode(
            st.packedBits({
                a: { bits: 3 },
                b: { bits: 2 },
            }),
            { b: 2, a: 1 },
        );
    });

    it("encodes to spec", () => {
        expectEncodedAs(
            st.packedBits({
                a: { bits: 4 },
                b: { bits: 5 },
                c: { bits: 7 },
            }),
            { a: 4, b: 13, c: 77 },
            [212, 154],
        );
        expectEncodedAs(
            st.packedBits({
                a: { bits: 5 },
                b: { bits: 6 },
                c: { bits: 3 },
            }),
            { a: 17, b: 63, c: 3 },
            [241, 47], // ensure compatiblity with python library
        );
    });

    it("encodes empty", () => {
        expectEncode(st.packedBits({}), {});
    });

    it(`matches snapshots`, () => {
        encodeSnapshotTest(
            st.packedBits({
                a: { bits: 5 },
                b: { bits: 2 },
                c: { bits: 1 },
            }),
            { a: 1, b: 3, c: 0 },
        );

        encodeSnapshotTest(
            st.packedBits({
                number: { bits: 5 },
                puppy: { bits: 5 },
                buffer: { bits: 11 },
            }),
            { number: 1, puppy: 3, buffer: 510 },
        );

        encodeSnapshotTest(
            st.packedBits({
                isA: { bits: 1 },
                isB: { bits: 1 },
                a: { bits: 5 },
                isC: { bits: 1 },
                isD: { bits: 1 },
                b: { bits: 3 },
            }),
            { isA: 0, isB: 1, a: 13, isC: 1, isD: 0, b: 5 },
        );
    });

    // Type Tests
    expectTypeOf(
        st.packedBits({
            number: { bits: 2 },
            string: { bits: 3 },
        }),
    ).toEqualTypeOf<
        st.Serializer<{
            number: number;
            string: number;
        }>
    >();
});
