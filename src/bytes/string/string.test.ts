import { st } from "../../index.ts";
import { describe, expect, it } from "bun:test";
export const {
    assertEncodesAndDecodes,
    assertEncodesAs,
    assertEncodeThrows,
    assertEncodesAsSize,
    assertMatchesSnapshot,
} = st.createTestingUtils(expect);

describe("st.string", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.string(st.u8()),
            value: "foo",
        });
    });

    it("works on empty strings", () => {
        assertEncodesAndDecodes({
            serializer: st.string(st.u32()),
            value: "",
        });
    });
    
    it("works with variable length values for length", () => {
        const VAR_INT: st.Serializer<number> = {
            size: undefined,
            read: (ctx) => st.u8().read(ctx),
            write: (ctx, value) => st.u8().write(ctx, value),
        };
        assertEncodesAndDecodes({
            serializer: st.string(VAR_INT),
            value: "345345",
        });
    });

    it("supports characters past UTF-16", () => {
        assertEncodesAndDecodes({
            serializer: st.string(st.u32()),
            value: "𰀇𰀇𰀇",
        });
    });

    it("errors on numbers", () => {
        assertEncodeThrows({
            serializer: st.string(st.u8()),
            value: 8,
        });
    });

    it("works on long strings", () => {
        assertEncodesAndDecodes({
            serializer: st.string(st.u32()),
            value: "A".repeat(2 ** 24),
        });
    });

    it("errors on too long strings", () => {
        assertEncodeThrows({
            serializer: st.string(st.u8()),
            value: "A".repeat(256),
        });
    });
});
