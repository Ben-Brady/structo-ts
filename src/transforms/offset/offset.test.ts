import { describe, it } from "bun:test";
import { expectEncode } from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.offset(relative)", () => {
    it("encodes correctly with fixed offset", () => {
        const spec = st.object({
            foo: st.u32(),
            bar: st.pipe(
                st.u32(),
                st.offset("relative", -4), //
            ),
        });
        expectEncode(
            spec,
            { foo: 1, bar: 5 },
            { foo: 5, bar: 5 }, //
        );
    });

    it("encodes correctly with read offset", () => {
        const offset = st.createRememberedValue<number>();
        const spec = st.object({
            foo: st.u32(),
            offset: offset.save(st.s16()),
            bar: st.pipe(
                st.u32(),
                st.offset("relative", offset.load()), //
            ),
        });
        expectEncode(
            spec,
            { foo: 0, offset: -6, bar: 5 },
            { foo: 5, offset: -6, bar: 5 }, //
        );
    });
});

describe("st.offset(absolute)", () => {
    it("encodes correctly with fixed offset", () => {
        const spec = st.object({
            foo: st.u32(),
            bar: st.pipe(
                st.u32(),
                st.offset("absolute", 0), //
            ),
        });
        expectEncode(
            spec,
            { foo: 0, bar: 5 },
            { foo: 5, bar: 5 }, //
        );
    });

    it("encodes correctly with read offset", () => {
        const offset = st.createRememberedValue<number>();
        const spec = st.object({
            foo: st.u32(),
            offset: offset.save(st.u32()),
            bar: st.pipe(
                st.u32(),
                st.offset("absolute", offset.load()), //
            ),
        });
        expectEncode(
            spec,
            { foo: 0, offset: 0, bar: 5 },
            { foo: 5, offset: 0, bar: 5 }, //
        );
    });
});
