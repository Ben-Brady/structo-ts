import * as st from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertSerializerSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.lazy", () => {
    it("encodes correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.lazy(() =>
                st.object({
                    a: st.fixedArray(4, st.u8()),
                    b: st.u16(),
                }),
            ),
            value: {
                a: [1, 2, 3, 4],
                b: 2,
            },
        });
    });

    it("nested objects function", () => {
        assertEncodesAndDecodes({
            serializer: st.object({
                a: st.fixedArray(4, st.u8()),
                b: st.lazy(() =>
                    st.object({
                        a: st.lazy(() => st.u16()),
                    }),
                ),
            }),
            value: {
                a: [1, 2, 3, 4],
                b: { a: 1 },
            },
        });
    });

    it("size is calculated correctly", () => {
        assertSerializerSize({
            size: 5,
            serializer: st.lazy(() =>
                st.object({
                    b: st.lazy(() =>
                        st.object({
                            a: st.u32(),
                            b: st.u8(),
                        }),
                    ),
                }),
            ),
        });
    });
});
