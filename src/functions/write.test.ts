import { describe, expect, it } from "bun:test";
import { st } from "../index.ts";

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

    it("Writes with zero sized type", () => {
        const MisconfiguredType: st.Serializer<null> = {
            size: 0,
            write: (ctx) => ctx.reserve(1), // still try to reserve
            read: () => null,
        };
        expect(() => st.write(MisconfiguredType, null));
    });
});
