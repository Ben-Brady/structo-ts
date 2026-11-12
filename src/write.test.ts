import { describe, expect, it } from "bun:test";
import { st } from "./index.ts";

const toBytes = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer));

describe("st.write", () => {
    it("writes correct data", () => {
        {
            const buffer = st.write(st.u8(), 52);
            expect(toBytes(buffer)).toEqual([52]);
        }
        {
            const buffer = st.write(st.string(st.u8()), "Hii");
            expect(toBytes(buffer)).toEqual([3, 72, 105, 105]);
        }
    });

    it("returns correctly sized buffers", () => {
        {
            const buffer = st.write(st.u32(), 1);
            expect(buffer.byteLength).toBe(4);
        }
        {
            const str = "If you are reading this, you're super cool :)";
            const buffer = st.write(st.string(st.u32()), str);
            expect(buffer.byteLength).toBe(4 + str.length);
        }
    });

    it("returns new buffer each time", () => {
        const a = st.write(st.u32(), 1);
        const b = st.write(st.u32(), 1);
        expect(a).not.toBe(b);
    });
});

describe("st.writeInto", () => {
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
