import { st } from "../src";

import { readFileSync } from "node:fs";
const path = import.meta.resolve("./data/image.png").replace("file://", "");
const data = readFileSync(path).buffer;

const hexLiteral = (hexBytes: string[]) => {
    const hex = hexBytes.join("");
    const underlying = st.fixedBytes(hexBytes.length);
    return st.literal(st.asHex(underlying), hex.toUpperCase());
};

const PngFile = st.lazy(() =>
    st.object({
        header: hexLiteral(["89", "50", "4E", "47", "0D", "0A", "1A", "0A"]),
        chunks: st.exhuastiveArray(GenericChunk),
    }),
);

const length = st.createRememberedValue<number>();
const GenericChunk = st.object({
    length: length.save(st.u32("big")),
    type: st.asAscii(st.fixedBytes(4)),
    data: st.bytes(length.load()),
    crc: st.u32(),
});

const start = performance.now();
const file = st.read(PngFile, data);

for (const chunk of file.chunks) {
    console.log(`${chunk.type} - ${chunk.length} bytes`);
}
console.log(`Loaded in ${(performance.now() - start).toFixed()}ms`);
