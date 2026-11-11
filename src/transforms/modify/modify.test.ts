import * as st from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.modify", () => {
    it("encodes correctly", () => {
        const data = st.write(st.u32(), 10);

        const output = st.read(
            st.pipe(
                st.u32(),
                st.modify((v) => v + 8),
            ),
            data,
        );
        expect(output).toBe(18);
    });

    it("cannot be written", () => {
        assertEncodeThrows(
            st.pipe(
                st.u32(),
                st.modify((v) => v + 8),
            ),
            3,
        );
    });

    it("does not modify size", () => {
        const spec = st.pipe(
            st.u32(),
            st.modify((v) => v + 8),
        );
        expect(spec.size).toBe(4);
    });
});
