import { describe, it, expect } from "bun:test";
import { expectEncode, expectError, randint } from "./utils.test";

import * as st from "../index";

describe("st.string", () => {
    const string_u8 = st.string({ length: st.u8() });
    const string_u32 = st.string({ length: st.u32() });

    it("encode correctly", () => {
        expectEncode(string_u8, "foo");
    });
    it("works on empty strings", () => {
        expectEncode(string_u32, "");
    });
});
