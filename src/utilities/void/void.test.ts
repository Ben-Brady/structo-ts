import { st } from "../../index.ts";
import { describe, expect, it } from "vitest";
const { assertEncodesAndDecodes, assertEncodesAs, assertMatchesSnapshot } =
    st.createTestingUtils(expect);

describe("st.void", () => {
    it(`write/read test `, () => {
        assertEncodesAndDecodes({
            serializer: st.void(),
            value: undefined,
        });
    });

    it(`encodes to zero bytes`, () => {
        assertEncodesAs({
            serializer: st.void(),
            value: undefined,
            expected: [],
        });
    });

    it(`matches snapshots`, () => {
        assertMatchesSnapshot({
            serializer: st.void(),
            value: undefined,
        });
    });
});
