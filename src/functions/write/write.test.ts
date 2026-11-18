import { describe, expect, it } from "vitest";
import { st } from "../../index.ts";
import { faker } from "@faker-js/faker";

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

    it("Writes with zero initialSize", () => {
        st.write(st.string(st.u32()), "fooo", { initialSize: 0 });
    });

    it("Writes with intialSize set", () => {
        const serializer = st.object({
            name: st.string(st.u32()),
            age: st.f64(),
            tags: st.array(st.u8(), st.string(st.u16())),
        });
        faker.seed(0);
        const user = {
            name: faker.person.fullName(),
            age: faker.number.float({ min: 0, max: 120 }),
            tags: Array.from({ length: 50 }, () => faker.string.uuid()),
        };

        st.write(serializer, user, { initialSize: 0 });
        for (let i = 0; i < 4000; i++) {
            st.write(serializer, user, { initialSize: i });
        }
    });

    it("handles recursive objects", () => {
        // Need to manually type to do redursive
        interface Node {
            tag: string;
            children: Node[];
        }
        const Node: st.Serializer<Node> = st.lazy(() =>
            st.object({
                tag: st.string(st.u32()),
                children: st.array(st.u16(), Node),
            }),
        );

        st.write(Node, {
            tag: "div",
            children: [
                { tag: "img", children: [] },
                {
                    tag: "div",
                    children: [{ tag: "span", children: [] }],
                },
            ],
        });
    });
});
