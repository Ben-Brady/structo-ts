import { describe, it, expect } from "bun:test";
import { expectEncode, expectEncodeSnapshot, expectError } from "../utils.test";

import * as st from "../../index";

describe("st.packedBits", () => {
    it("encodes correctly", () => {
        const spec = st.packedBits({
            size: 1,
            definition: { a: 1, b: 1, c: 2, d: 1 },
        });
        const data = st.write(spec, { a: 1, b: 1, c: 1, d: 1 });

        const arr = new Uint8Array(data);
        expect(arr[0]).toBe(0b11011000);
    });

    it("encodes correctly across boundaries", () => {
        const spec = st.packedBits({
            size: 4,
            definition: {
                a: 5,
                b: 11,
                c: 10,
                d: 6,
            },
        });
        expectEncode(spec, {
            a: 15,
            b: 2 ** 10,
            c: 2 ** 9,
            d: 63,
        });
    });

    it("encodes empty", () => {
        expectEncode(st.packedBits({ size: 0, definition: {} }), {});
        expectEncode(st.packedBits({ size: 1, definition: {} }), {});
    });

    it("values too large throw error", () => {
        expectError(() => {
            st.write(st.packedBits({ size: 1, definition: { a: 1 } }), { a: 2 });
        });
    });

    it(`matches snapshots`, () => {
        expectEncodeSnapshot(
            st.packedBits({
                size: 1,
                definition: { a: 1, b: 2, c: 1 },
            }),
            { a: 1, b: 0, c: 1 },
        );
        expectEncodeSnapshot(
            st.packedBits({
                size: 2,
                definition: { a: 1, b: 11, c: 1 },
            }),
            { a: 1, b: 2 ** 10, c: 1 },
        );
    });
});
