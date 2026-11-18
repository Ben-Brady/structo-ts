import { describe, expect, it } from "vitest";
import { st } from "../../index.ts";

describe("st.estimateSize", () => {
    it("use serializer.size where available", () => {
        const serializer = {
            size: 2,
            estimateSize: () => 4,
            read() {},
            write() {},
        };
        expect(st.estimateSize(serializer, undefined)).toBe(2);
    });

    it("use serializer.estimateSize where available", () => {
        const serializer = {
            estimateSize: () => 4,
            read() {},
            write() {},
        };
        expect(st.estimateSize(serializer, undefined)).toBe(4);
    });

    it("uses 0 when none available", () => {
        const serializer = {
            read() {},
            write() {},
        };
        expect(st.estimateSize(serializer, undefined)).toBe(0);
    });
});
