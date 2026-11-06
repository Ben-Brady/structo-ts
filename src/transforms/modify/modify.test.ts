import { describe, expect, it } from "bun:test";
import { expectEncodeErrors } from "../../utils.test.ts";

import * as st from "../../index.ts";

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
        expectEncodeErrors(
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
