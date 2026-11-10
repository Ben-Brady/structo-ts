import { describe, expect, it } from "bun:test";
import { expectEncode } from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.lazy", () => {
    it("encodes correctly", () => {
        const spec = st.lazy(() =>
            st.object({
                a: st.fixedArray(4, st.u8()),
                b: st.u16(),
            }),
        );
        expectEncode(spec, {
            a: [1, 2, 3, 4],
            b: 2,
        });
    });

    it("nested objects function", () => {
        const spec = st.object({
            a: st.fixedArray(4, st.u8()),
            b: st.lazy(() =>
                st.object({
                    a: st.lazy(() => st.u16()),
                }),
            ),
        });
        expectEncode(spec, {
            a: [1, 2, 3, 4],
            b: { a: 1 },
        });
    });

    it("size is calculated correctly", () => {
        const spec = st.lazy(() =>
            st.object({
                b: st.lazy(() =>
                    st.object({
                        a: st.u32(),
                        b: st.u8(),
                    }),
                ),
            }),
        );
        expect(spec.size).toBe(5);
    });
});
