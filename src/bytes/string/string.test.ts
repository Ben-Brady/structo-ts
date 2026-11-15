import { st } from "../../index.ts";
import { describe, expect, it } from "vitest";
import { SCATCH_SIZE } from "./string.ts";
const { assertEncodesAndDecodes, assertEncodeThrows, assertEncodesAsSize } =
    st.createTestingUtils(expect);

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

    // it("works on long strings", () => {
    //     const serializer = st.string(st.u32());
    //     const value =  "A".repeat(2 ** 24)
    //     const parsedData = st.read(serializer,st.write(serializer, value))

    //     expect(parsedData).toBe(value)
    // });

    it("works on strings near scratch size", () => {
        const serializer = st.string(st.u32());
        assertEncodesAsSize({
            serializer,
            value: "A".repeat(SCATCH_SIZE),
            size: SCATCH_SIZE + 4,
        });
        assertEncodesAsSize({
            serializer,
            value: "A".repeat(SCATCH_SIZE - 1),
            size: SCATCH_SIZE - 1 + 4,
        });
        assertEncodesAsSize({
            serializer,
            value: "A".repeat(SCATCH_SIZE + 1),
            size: SCATCH_SIZE + 1 + 4,
        });
        assertEncodesAsSize({
            serializer,
            value: "A".repeat(SCATCH_SIZE * 2 + 1),
            size: SCATCH_SIZE * 2 + 1 + 4,
        });
    });

    it("errors on too long strings", () => {
        assertEncodeThrows({
            serializer: st.string(st.u8()),
            value: "A".repeat(256),
        });
    });
});
