import { st } from "../../index.ts";
import { describe, expect, it } from "vitest";
const { assertEncodesAndDecodes } = st.createTestingUtils(expect);

describe("st.asDate", () => {
    it("works", () => {
        assertEncodesAndDecodes({
            serializer: st.asDate(st.u64()),
            value: new Date(2000, 11, 2),
        });
    });
});
