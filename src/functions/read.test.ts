import { describe, expect, it } from "bun:test";
import { st } from "../index.ts";

const bytes = (bytes: number[]) => new Uint8Array(bytes).buffer;

describe("st.read", () => {
    it("Reads data correctly from a buffer", () => {
        {
            const byte = st.read(st.u8(), bytes([2]));
            expect(byte).toBe(2);
        }
        {
            const data = st.read(
                st.object({ a: st.u8(), b: st.u16() }), //
                bytes([2, 0, 4]),
            );
            expect(data).toEqual({ a: 2, b: 1024 });
        }
    });

    it("throws exceptions correctly", () => {
        expect(() => {
            const AlwaysErrors = {
                write() {},
                read() {
                    throw new Error("Cannot Write");
                },
            };
            st.read(AlwaysErrors, bytes([2]));
        });
    });
});
