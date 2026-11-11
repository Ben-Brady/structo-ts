import { st } from "../../index.ts";
import { describe, expect, expectTypeOf, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.object", () => {
    it("encodes correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.object({
                a: st.u8(),
                b: st.u8(),
            }),
            value: { b: 2, a: 1 },
        });
    });

    it("encodes correctly in correct order", () => {
        assertEncodesAs({
            serializer: st.object({
                a: st.u8(),
                b: st.u16("little"),
                c: st.u16("big"),
            }),
            value: { a: 1, b: 2, c: 3 },
            expected: new Uint8Array([1, 2, 0, 0, 3]),
        });
    });

    it("encodes nested correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.object({
                a: st.object({ a: st.u8() }),
                b: st.u8(),
            }),
            value: { a: { a: 2 }, b: 1 },
        });
    });

    it("encode in correct order", () => {
        const data = st.write(
            st.object({
                a: st.u8(),
                b: st.u8(),
            }),
            { b: 2, a: 1 },
        );
        const arr = new Uint8Array(data);
        expect(arr[0]).toBe(1);
        expect(arr[1]).toBe(2);
    });

    it("encodes empty", () => {
        assertEncodesAndDecodes({
            serializer: st.object({}),
            value: {},
        });
    });

    it(`matches snapshots`, () => {
        assertMatchesSnapshot({
            serializer: st.object({
                number: st.u32(),
                puppy: st.string(st.s32()),
                buffer: st.fixedBytes(4),
            }),
            value: {
                number: 1,
                puppy: "woof woof bark bark",
                buffer: new Uint8Array([19, 87, 19, 83]),
            },
        });
    });

    expectTypeOf(
        st.object({
            number: st.u32(),
            string: st.string(st.u32()),
        }),
    ).toEqualTypeOf<
        st.Serializer<{
            number: number;
            string: string;
        }>
    >();
});
