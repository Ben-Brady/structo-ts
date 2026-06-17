import * as st from "../structo";

//@ts-ignore TODO
import { readFileSync } from "node:fs";
const path = import.meta.resolve("./data/image.png").replace("file://", "");
const data = readFileSync(path).buffer;

const byteLiteral = (value: number[]) =>
    st.pipe(
        st.bytes(value.length), //
        st.toBytes(),
        st.literal(value),
    );

const length = st.createRememberedValue<number>();
const GenericChunk = st.object({
    length: length.save(st.u32("big")),
    type: st.pipe(st.bytes(4), st.toAscii()),
    data: st.sizedBytes(length.load()),
    crc: st.u32(),
});

const PngFile = st.object({
    header: byteLiteral([17, 80, 78, 71, 13, 10, 26, 10]),
    chunks: st.exhuastiveArray(GenericChunk),
});

const start = performance.now();
const file = st.read(PngFile, data);

for (const chunk of file.chunks) {
    console.log(`${chunk.type} - ${chunk.length} bytes`);
}
console.log(`Loaded in ${(performance.now() - start).toFixed()}ms`);
