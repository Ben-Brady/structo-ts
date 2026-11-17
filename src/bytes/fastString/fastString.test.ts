import { st } from "../../index.ts";
import { describe, expect, it } from "vitest";

const { assertEncodesAndDecodes, assertEncodeThrows, assertEncodesAsSize } =
    st.createTestingUtils(expect);

describe("st.fastString", () => {
    it("encode correctly", () => {
        assertEncodesAndDecodes({
            serializer: st.fastString(st.u8()),
            value: "foo",
        });
        assertEncodesAsSize({
            serializer: st.fastString(st.u8()),
            value: "foo",
            size: 4,
        });
    });

    it("works on empty strings", () => {
        assertEncodesAndDecodes({
            serializer: st.fastString(st.u32()),
            value: "",
        });
    });

    it("does not work iwth variable length values for length", () => {
        const VAR_INT: st.Serializer<number> = {
            size: undefined,
            read: (ctx) => st.u8().read(ctx),
            write: (ctx, value) => st.u8().write(ctx, value),
        };
        expect(() => st.fastString(VAR_INT)).toThrow();
    });

    it("supports characters past UTF-16", () => {
        assertEncodesAndDecodes({
            serializer: st.fastString(st.u32()),
            value: "𰀇𰀇𰀇",
        });
    });

    it("errors on numbers", () => {
        assertEncodeThrows({
            serializer: st.fastString(st.u8()),
            value: 8,
        });
    });

    // it("works on long strings", () => {
    //     const serializer = st.fastString(st.u32());
    //     const value =  "A".repeat(2 ** 24)
    //     const parsedData = st.read(serializer,st.write(serializer, value))

    //     expect(parsedData).toBe(value)
    // });

    it("errors on too long strings", () => {
        assertEncodeThrows({
            serializer: st.fastString(st.u8()),
            value: "A".repeat(256),
        });
    });
});
