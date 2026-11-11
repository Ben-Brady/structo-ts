import * as st from "../../index.ts";
import { describe, expect, expectTypeOf, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

function byte(str: string): number {
    let bits = Array.from(str).filter((v) => v === "0" || v === "1");
    return parseInt(bits.join(""), 2);
}

function bytes(str: string): number[] {
    let bits = Array.from(str)
        .filter((v) => v === "0" || v === "1")
        .join("");

    const bitsize = bits.length;
    bits = bits.padEnd(Math.ceil(bits.length / 8) * 8, "0");

    let result: number[] = [];
    for (let i = 0; i < bitsize; i += 8) {
        const byteStr = bits.slice(i, i + 8);
        result.push(parseInt(byteStr, 2));
    }

    return result;
}

describe("st.packedBits", () => {
    it("byte test utils function correctly", () => {
        expect(byte("11111111")).toEqual(255);
        expect(byte("111")).toEqual(7);
        expect(byte("101")).toEqual(5);
    });

    it("bytes utils function correctly", () => {
        expect(bytes("11111111")).toEqual([255]);
        expect(bytes("10000000")).toEqual([128]);
        expect(bytes("11111111 10000000")).toEqual([255, 128]);
        expect(bytes("00110000 00000101")).toEqual([48, 5]);
        expect(bytes("00-11-00-00")).toEqual([48]);
        expect(bytes("11010 100110 010")).toEqual(bytes("11010100 11001000"));
    });

    it("encodes correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.packedBits({
                a: { bits: 3 },
                b: { bits: 5 },
            }),
            value: { b: 2, a: 1 },
        });
    });

    it("handles not saturating bits", () => {
        assertEncodesAndDecodes({
            serializer: st.packedBits({
                a: { bits: 3 },
                b: { bits: 2 },
            }),
            value: { b: 2, a: 1 },
        });
    });

    it("encodes to spec", () => {
        assertEncodesAs({
            serializer: st.packedBits({ a: { bits: 4 }, b: { bits: 5 }, c: { bits: 7 } }),
            value: { a: byte("1101"), b: byte("1001-1"), c: byte("1111-000") },
            expected: bytes("1101 1001-1 1111-000"),
        });
        assertEncodesAs({
            serializer: st.packedBits({ a: { bits: 5 }, b: { bits: 6 }, c: { bits: 3 } }),
            value: { a: byte("11010"), b: byte("100110"), c: byte("010") },
            expected: bytes("11010 100110 010"),
        });
    });

    it("encodes empty", () => {
        assertEncodesAndDecodes({
            serializer: st.packedBits({}),
            value: {},
        });
    });

    it("encodes large sizes", () => {
        assertEncodesAndDecodes({
            serializer: st.packedBits({
                a: { bits: 48 },
                b: { bits: 48 },
                c: { bits: 48 },
                d: { bits: 48 },
                e: { bits: 39 },
            }),
            value: {
                a: 63431254,
                b: 6345323,
                c: 6345123,
                d: 5675923,
                e: 124567423,
            },
        });
    });

    it("encodes to correct size", () => {
        assertEncodesAsSize({
            serializer: st.packedBits({ a: { bits: 8 } }),
            value: { a: 255 },
            size: 1,
        });
        assertEncodesAsSize({
            serializer: st.packedBits({
                a: { bits: 8 },
                b: { bits: 3 },
                c: { bits: 5 },
            }),
            value: { a: 255, b: 1, c: 1 },
            size: 2,
        });
        assertEncodesAsSize({
            serializer: st.packedBits({
                a: { bits: 8 },
                b: { bits: 5 },
                c: { bits: 6 },
            }),
            value: { a: 255, b: 1, c: 1 },
            size: 3,
        });
    });

    it("encodes at max value", () => {
        assertEncodesAndDecodes({
            serializer: st.packedBits({ a: { bits: 8 } }),
            value: { a: 255 },
        });
    });

    it("too large throws error", () => {
        assertEncodeThrows({
            serializer: st.packedBits({ a: { bits: 3 } }),
            value: { a: byte("1000") },
        });
    });

    it("smaller than zero throws error", () => {
        assertEncodeThrows({
            serializer: st.packedBits({ a: { bits: 8 } }),
            value: { a: -1 },
        });
    });

    it(`matches snapshots`, () => {
        assertMatchesSnapshot({
            serializer: st.packedBits({
                a: { bits: 5 },
                b: { bits: 2 },
                c: { bits: 1 },
            }),
            value: { a: 1, b: 3, c: 0 },
        });

        assertMatchesSnapshot({
            serializer: st.packedBits({
                number: { bits: 5 },
                puppy: { bits: 5 },
                buffer: { bits: 11 },
            }),
            value: { number: 1, puppy: 3, buffer: 510 },
        });

        assertMatchesSnapshot({
            serializer: st.packedBits({
                isA: { bits: 1 },
                isB: { bits: 1 },
                a: { bits: 5 },
                isC: { bits: 1 },
                isD: { bits: 1 },
                b: { bits: 3 },
            }),
            value: { isA: 0, isB: 1, a: 13, isC: 1, isD: 0, b: 5 },
        });
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
