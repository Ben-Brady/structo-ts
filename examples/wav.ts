import * as st from "../structo";

//@ts-ignore TODO
import { readFileSync } from "node:fs";
const path = import.meta.resolve("./data/town.wav").replace("file://", "");
const data = readFileSync(path).buffer;

const hexLiteral = (value: string) =>
    st.pipe(
        st.bytes(value.length / 2), //
        st.toHex(),
        st.literal(value.toUpperCase()),
    );

const fileSize = st.createRememberedValue<number>();
type RiffFile = st.Infer<typeof RiffFile>;
const RiffFile = st.object({
    filetype: hexLiteral("52494646"),
    size: fileSize.save(st.u32()),
    format: hexLiteral("57415645"),
    data: st.sizedBytes(
        st.pipe(
            fileSize.load(),
            st.modify((v: number) => v - 16),
        ),
    ),
});

const chunkSize = st.createRememberedValue<number>();
type RiffChunk = st.Infer<typeof RiffChunk>;
const RiffChunk = st.object({
    format: st.bytes(4),
    size: chunkSize.save(st.u32("little")),
    data: st.sizedBytes(chunkSize.load()),
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

const compareBytes = (buffer: ArrayBuffer, value: number[]) =>
    JSON.stringify(Array.from(new Uint8Array(buffer))) == JSON.stringify(value);

function readRiffFile(buffer: ArrayBuffer) {
    const file = st.read(RiffFile, buffer);

    const ctx = st.createReaderContext(file.data);
    let chunks: RiffChunk[] = [];
    while (ctx.offset < file.data.byteLength) {
        chunks.push(RiffChunk.read(ctx));
    }

    const fmtchunk = chunks.find((v) => compareBytes(v.format, [0x66, 0x6d, 0x74, 0x20]))!;
    const format = st.read(FormatData, fmtchunk.data);

    const datachunk = chunks.find((v) => compareBytes(v.format, [0x64, 0x61, 0x74, 0x61]))!;
    const data = datachunk.data;

    return { format, data };
}

const file = readRiffFile(data);
console.log(file);
