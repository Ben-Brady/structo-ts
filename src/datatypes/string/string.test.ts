import { describe, it } from "bun:test";
import { encodeFailTest, encodeTest } from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.string", () => {
    it("encode correctly", () => {
        encodeTest(st.string(st.u8()), "foo");
    });

    it("works on empty strings", () => {
        encodeTest(st.string(st.u32()), "");
    });

    it("errors on numbers", () => {
        //@ts-expect-error, intentional mistake
        encodeFailTest(st.string(st.u8()), 8);
    });

    it("works on long strings", () => {
        encodeTest(st.string(st.u32()), "A".repeat(2 ** 24));
    });

    it("errors on too long strings", () => {
        encodeFailTest(st.string(st.u8()), "A".repeat(256));
    });
});
