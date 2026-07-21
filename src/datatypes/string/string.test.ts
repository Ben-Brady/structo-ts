import { describe, it } from "bun:test";
import { expectEncodeFail, expectEncode } from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.string", () => {
    it("encode correctly", () => {
        expectEncode(st.string(st.u8()), "foo");
    });

    it("works on empty strings", () => {
        expectEncode(st.string(st.u32()), "");
    });

    it("errors on numbers", () => {
        //@ts-expect-error, intentional mistake
        expectEncodeFail(st.string(st.u8()), 8);
    });

    it("works on long strings", () => {
        expectEncode(st.string(st.u32()), "A".repeat(2 ** 24));
    });

    it("errors on too long strings", () => {
        expectEncodeFail(st.string(st.u8()), "A".repeat(256));
    });
});
