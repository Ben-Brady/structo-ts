import * as st from "../../structo";
import { readFileSync } from "node:fs";

const path = import.meta.resolve("./town.wav").replace("file:///", "");
const data = readFileSync(path).buffer;

const Foo = st.pipe(
    st.u32(),
    st.positionOffset<number>(-8),
    st.transform((v: number) => new Date(v - 16)),
);

type RiffFile = st.Infer<typeof RiffFile>;
const RiffFile = st.object({
    filetype: st.byteLiteral([0x52, 0x49, 0x46, 0x46]),
    size: st.u32(),
    format: st.byteLiteral([0x57, 0x41, 0x56, 0x45]),
    data: st.sizedBuffer({
        length: st.pipe(
            st.u32(),
            st.positionOffset<number>(-8),
            st.transform((v: number) => new Date(v - 16)),
        ),
    }),
});

type RiffChunk = st.Infer<typeof RiffChunk>;
const RiffChunk = st.object({
    format: st.buffer(4),
    size: st.u32("little"),
    data: st.sizedBuffer({
        length: st.pipe(st.u32(), st.positionOffset(-4)),
    }),
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
