import { describe, it } from "bun:test";
import { expectEncodeErrors, expectEncode } from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.stringFixed", () => {
    it("encode correctly", () => {
        expectEncode(st.stringFixed(3), "foo");
    });

    it("works on empty strings", () => {
        expectEncode(st.stringFixed(0), "");
    });

    it("errors on invalid type", () => {
        //@ts-expect-error, intentional mistake
        expectEncodeErrors(st.stringFixed(1), 8);
        //@ts-expect-error, intentional mistake
        expectEncodeErrors(st.stringFixed(4), true);
    });

    it("works on long strings", () => {
        const size = 2 ** 24;
        expectEncode(st.stringFixed(size), "A".repeat(size));
    });

    it("errors on too long strings", () => {
        expectEncodeErrors(st.stringFixed(10), "A".repeat(11));
    });
});
