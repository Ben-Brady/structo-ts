import { st } from "../src";

//@ts-expect-error node import
import { readFileSync } from "node:fs";
const path = import.meta.resolve("./data/town.wav").replace("file://", "");
const data = readFileSync(path).buffer;

const hexLiteral = (value: string) =>
    st.pipe(
        st.fixedBytes(value.length / 2), //
        st.toHex(),
        st.literal(value.toUpperCase()),
    );

const fileSize = st.createReference<number>();
type RiffFile = st.Infer<typeof RiffFile>;
const RiffFile = st.object({
    filetype: hexLiteral("52494646"),
    size: fileSize.pointer(st.u32()),
    format: hexLiteral("57415645"),
    data: st.bytes(
        st.pipe(
            fileSize.deref(),
            st.encode({
                encode: (v) => v + 16,
                decode: (v) => v - 16,
            }),
        ),
    ),
});

const chunkSize = st.createReference<number>();
type RiffChunk = st.Infer<typeof RiffChunk>;
const RiffChunk = st.object({
    format: st.pipe(st.fixedBytes(4), st.toAscii()),
    size: chunkSize.pointer(st.u32("little")),
    data: st.bytes(chunkSize.deref()),
});

type FormatData = st.Infer<typeof FormatData>;
const FormatData = st.object({
    audioFormat: st.u16(),
    channels: st.u16(),
    frequency: st.u32(),
    bytePerSecond: st.u32(),
    bytePerBlock: st.u16(),
    bitsPerSample: st.u16(),
});

function readRiffFile(buffer: ArrayBuffer) {
    const file = st.read(RiffFile, buffer);

    let offset = 0;
    let chunks: RiffChunk[] = [];
    while (offset < file.data.byteLength) {
        const chunk = st.read(RiffChunk, buffer, offset);
        chunks.push(chunk);
    }

    const fmtchunk = chunks.find((v) => v.format === "fmt ")!;
    const datachunk = chunks.find((v) => v.format === "data")!;

    const format = st.read(FormatData, fmtchunk.data);
    const data = datachunk.data;

    return { format, data };
}

const file = readRiffFile(data);
console.log(file);
