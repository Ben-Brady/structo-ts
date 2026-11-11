import { st } from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.Void", () => {
    it(`write/read test `, () => {
        assertEncodesAndDecodes({
            serializer: st.Void(),
            value: undefined,
        });
    });

    it(`encodes to zero bytes`, () => {
        assertEncodesAs({
            serializer: st.Void(),
            value: undefined,
            expected: [],
        });
    });

    it(`matches snapshots`, () => {
        assertMatchesSnapshot({
            serializer: st.Void(),
            value: undefined,
        });
    });
});
