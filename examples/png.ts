import * as st from "../structo";

//@ts-ignore TODO
import { readFileSync } from "node:fs";
const path = import.meta.resolve("./data/image.png").replace("file://", "");
const data = readFileSync(path).buffer;

const length = st.createRememberedValue<number>();
const GenericChunk = st.object({
    length: length.save(st.u32("big")),
    type: st.pipe(st.bytes(4), st.toBytes()),
    data: st.sizedBytes(length.load()),
    crc: st.u32(),
});

const PngFile = st.object({
    header: st.bytesLiteral([137, 80, 78, 71, 13, 10, 26, 10]),
    chunks: st.exhuastiveArray(GenericChunk),
});

const start = performance.now();
const file = st.read(PngFile, data);

for (const chunk of file.chunks) {
    console.log(chunk.type, chunk.length);
}
console.log(`Loaded in ${(performance.now() - start).toFixed()}ms`);
