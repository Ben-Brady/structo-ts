import { st } from "../../index.ts";
import { describe, expect, it } from "vitest";
const { assertEncodesAndDecodes, assertEncodeThrows, assertMatchesSnapshot } =
    st.createTestingUtils(expect);

describe("st.asDate('milliseconds')", () => {
    it("works", () => {
        assertEncodesAndDecodes({
            serializer: st.asDate(st.u64()),
            value: new Date(2000, 11, 2),
        });
    });

    it("errors when can't store", () => {
        assertEncodeThrows({
            serializer: st.asDate(st.u32()),
            value: new Date(2000, 11, 2),
        });
    });

    it("matches snapshots", () => {
        assertMatchesSnapshot({
            serializer: st.asDate(st.u64()),
            value: new Date(2000, 11, 2),
        });
        assertMatchesSnapshot({
            serializer: st.asDate(st.u64()),
            value: new Date(2005, 11, 2),
        });
        assertMatchesSnapshot({
            serializer: st.asDate(st.u64()),
            value: new Date(1999, 4, 7),
        });
    });
});

describe("st.asDate('seconds')", () => {
    it("works", () => {
        assertEncodesAndDecodes({
            serializer: st.asDate(st.u32(), "seconds"),
            value: new Date(2000, 11, 2),
        });
    });

    it("errors when can't store", () => {
        assertEncodeThrows({
            serializer: st.asDate(st.u16()),
            value: new Date(2000, 11, 2),
        });
    });
    
    it("matches snapshots", () => {
        assertMatchesSnapshot({
            serializer: st.asDate(st.u64(), "seconds"),
            value: new Date(2000, 11, 2),
        });
        assertMatchesSnapshot({
            serializer: st.asDate(st.u32(), "seconds"),
            value: new Date(2005, 11, 2),
        });
        assertMatchesSnapshot({
            serializer: st.asDate(st.u32(), "seconds"),
            value: new Date(1999, 4, 7),
        });
    });
});
