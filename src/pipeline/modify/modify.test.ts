import { st } from "../../index.ts";
import { describe, expect, it } from "vitest";
const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
    assertSerializerSize,
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
        assertEncodeThrows({
            serializer: st.pipe(
                st.u32(),
                st.modify((v) => v + 8),
            ),
            value: 3,
        });
    });

    it("does not modify size", () => {
        const serializer = st.pipe(
            st.u32(),
            st.modify((v) => v + 8),
        );
        assertSerializerSize({ serializer, size: 4 });
    });
});
