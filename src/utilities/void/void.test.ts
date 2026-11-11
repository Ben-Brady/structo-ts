import * as st from "../../index.ts";
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
        assertEncodesAndDecodes(st.Void(), undefined);
    });

    it(`encodes to zero bytes`, () => {
        assertEncodesAs(st.Void(), undefined, []);
    });

    it(`matches snapshots`, () => {
        assertMatchesSnapshot(st.Void(), undefined);
    });
});
