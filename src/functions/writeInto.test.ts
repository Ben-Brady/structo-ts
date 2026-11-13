import { describe, expect, it } from "bun:test";
import { st } from "../index.ts";

const toBytes = (buffer: ArrayBuffer | SharedArrayBuffer) => Array.from(new Uint8Array(buffer));

describe("st.writeInto", () => {
    it("bytes are actually written", () => {
        {
            const buffer = new ArrayBuffer(32);
            st.writeInto(buffer, 0, st.u32(), 10);
            expect(toBytes(buffer.slice(0, 4))) //
                .toEqual([10, 0, 0, 0]);
        }
        {
            const buffer = new ArrayBuffer(32);
            st.writeInto(buffer, 28, st.u32(), 10);
            expect(toBytes(buffer.slice(28, 32))) //
                .toEqual([10, 0, 0, 0]);
        }
    });

    it("SharedArrayBuffer works", () => {
        {
            const buffer = new SharedArrayBuffer(32);
            st.writeInto(buffer, 0, st.u32(), 10);
            expect(toBytes(buffer.slice(0, 4))) //
                .toEqual([10, 0, 0, 0]);
        }
        {
            const buffer = new SharedArrayBuffer(32);
            st.writeInto(buffer, 28, st.u32(), 10);
            expect(toBytes(buffer.slice(28, 32))) //
                .toEqual([10, 0, 0, 0]);
        }
    });

    it("returns bytes written correctly", () => {
        const buffer = new ArrayBuffer(32);
        {
            const normalSize = st.writeInto(buffer, 0, st.u32(), 10);
            expect(normalSize).toBe(4);
        }
        {
            const offsettedSize = st.writeInto(buffer, 5, st.u32(), 10);
            expect(offsettedSize).toBe(4);
        }
    });

    it("errors when overflowing", () => {
        {
            expect(() => {
                const buffer = new ArrayBuffer(7);
                st.writeInto(buffer, 0, st.u64(), 10);
            }).toThrow();
        }
        {
            expect(() => {
                const buffer = new ArrayBuffer(16);
                st.writeInto(buffer, 9, st.u64(), 10);
            }).toThrow();
        }
    });
});
