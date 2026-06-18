import * as st from "../src";

//@ts-ignore TODO
import { readFileSync } from "node:fs";
const path = import.meta.resolve("./data/image.png").replace("file://", "");
const data = readFileSync(path).buffer;

const hexLiteral = (value: string) =>
    st.pipe(
        st.bytes(value.length / 2), //
        st.toHex(),
        st.literal(value.toUpperCase()),
    );

const PngFile = st.lazy(() =>
    st.object({
        header: hexLiteral("89504E470D0A1A0A"),
        chunks: st.exhuastiveArray(GenericChunk),
    }),
);

const length = st.createRememberedValue<number>();
const GenericChunk = st.object({
    length: length.save(st.u32("big")),
    type: st.pipe(st.bytes(4), st.toAscii()),
    data: st.sizedBytes(length.load()),
    crc: st.u32(),
});

const start = performance.now();
const file = st.read(PngFile, data);

for (const chunk of file.chunks) {
    console.log(`${chunk.type} - ${chunk.length} bytes`);
}
console.log(`Loaded in ${(performance.now() - start).toFixed()}ms`);
