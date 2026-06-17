import { describe, it } from "bun:test";
import { expectEncode, expectError } from "../utils.test";

import * as st from "../../index";

describe("st.string", () => {
    const string_u8 = st.string(st.u8());
    const string_u32 = st.string(st.u32());

    it("encode correctly", () => {
        expectEncode(string_u8, "foo");
    });

    it("works on empty strings", () => {
        expectEncode(string_u32, "");
    });

    it("errors on numbers", () => {
        expectError(() => {
            //@ts-expect-error, intentional mistake
            st.write(st.string(st.u8()), 8)
        })
    });

    it("errors on too long strings", () => {
        expectError(() => {
            st.write(string_u8, "A".repeat(256));
        });
    });
});
