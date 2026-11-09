import { describe, it } from "bun:test";
import {
    expectEncode,
    encodeSnapshotTest,
    expectEncodedAs,
} from "../../utils.test.ts";

import * as st from "../../index.ts";

describe("st.Void", () => {
    it(`write/read test `, () => {
        expectEncode(st.Void(), undefined);
    });

    it(`encodes to zero bytes`, () => {
        expectEncodedAs(st.Void(), undefined, []);
    });

    it(`matches snapshots`, () => {
        encodeSnapshotTest(st.Void(), undefined);
    });
});
