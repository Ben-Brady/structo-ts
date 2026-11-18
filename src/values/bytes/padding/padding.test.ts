import { st } from "../../../index.ts";
import { describe, expect, it } from "vitest";

const { assertEncodesAndDecodes, assertEncodesAs, assertMatchesSnapshot } =
    st.createTestingUtils(expect);

describe("st.padding", () => {
    it(`write/read test `, () => {
        assertEncodesAndDecodes({
            serializer: st.padding(4),
            value: undefined,
        });
    });

    it(`encodes to zero bytes`, () => {
        assertEncodesAs({
            serializer: st.padding(0),
            value: undefined,
            expected: [],
        });
        assertEncodesAs({
            serializer: st.padding(4),
            value: undefined,
            expected: [0, 0, 0, 0],
        });
        assertEncodesAs({
            serializer: st.padding(1024),
            value: undefined,
            expected: Array.from({ length: 1024 }, () => 0),
        });
    });

    it(`matches snapshots`, () => {
        assertMatchesSnapshot({ serializer: st.padding(0), value: undefined });
        assertMatchesSnapshot({ serializer: st.padding(1), value: undefined });
        assertMatchesSnapshot({ serializer: st.padding(4), value: undefined });
        assertMatchesSnapshot({ serializer: st.padding(1024), value: undefined });
    });
});
