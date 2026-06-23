import { describe, it } from "bun:test";
import { encodeTest, encodeSnapshotTest, expectError } from "../utils.test.js";

import * as st from "../index.js";

describe("st.toTypedArray", () => {
    it("encode correctly", () => {
        encodeTest(
            st.pipe(
                st.bytes(6), //
                st.toTypedArray(Uint8Array),
            ),
            new Uint8Array([1, 2, 3, 4, 5, 6]),
        );
    });

    it("encode different types correctly", () => {
        encodeTest(
            st.object({
                padding: st.u64(),
                data: st.pipe(
                    st.bytes(3), //
                    st.toTypedArray(Uint8Array),
                ),
            }),
            { padding: 0, data: new Uint8Array([1, 2, 3]) },
        );
        encodeTest(
            st.object({
                padding: st.u64(),
                data: st.pipe(
                    st.bytes(5 * 2), //
                    st.toTypedArray(Uint16Array),
                ),
            }),
            { padding: 0, data: new Uint16Array([1, 2, 3, 63, 74]) },
        );
        encodeTest(
            st.object({
                padding: st.u64(),
                data: st.pipe(
                    st.bytes(3 * 8), //
                    st.toTypedArray(Float64Array),
                ),
            }),
            { padding: 0, data: new Float64Array([Math.random(), Math.random(), Math.random()]) },
        );
    });

    it("errors when non-standard size", () => {
        expectError(() => {
            st.write(
                st.pipe(
                    st.bytes(3), //
                    st.toTypedArray(Uint16Array),
                ),
                new Uint16Array([1, 2]),
            );
        });
    });

    it("snapshot tests", () => {
        encodeSnapshotTest(
            st.pipe(
                st.bytes(4 * 2), //
                st.toTypedArray(Uint16Array),
            ),
            new Uint16Array([1, 6, 3, 12]),
        );
        encodeSnapshotTest(
            st.pipe(
                st.bytes(3 * 8), //
                st.toTypedArray(Float64Array),
            ),
            new Float64Array([1.52, 0.3523, 0.152]),
        );
    });
});
