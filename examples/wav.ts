import { st } from "../src/index.ts";

//@ts-expect-error node import
import { readFileSync } from "node:fs";
const path = import.meta.resolve("./data/town.wav").replace("file://", "");
const data = readFileSync(path).buffer;

const hexLiteral = (hexBytes: string[]) => {
    const hex = hexBytes.join("");
    const underlying = st.fixedBytes(hexBytes.length);
    return st.literal(st.asHex(underlying), hex.toUpperCase());
};

const fileSize = st.createReference<number>();
type RiffFile = st.Infer<typeof RiffFile>;
const RiffFile = st.object({
    filetype: hexLiteral(["52", "49", "46", "46"]),
    size: fileSize.pointer(st.u32()),
    format: hexLiteral(["57", "41", "56", "45"]),
    data: st.bytes(
        st.encodeAs(fileSize.deref(), {
            encode: (v) => v + 16,
            decode: (v) => v - 16,
        }),
    ),
});

const chunkSize = st.createReference<number>();
type RiffChunk = st.Infer<typeof RiffChunk>;
const RiffChunk = st.object({
    format: st.asAscii(st.fixedBytes(4)),
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
    const file = st.read(RiffFile);

    const ctx = st.createReaderContext(file.data.buffer);

    let chunks: RiffChunk[] = [];
    while (ctx.offset < file.data.byteLength) {
        chunks.push(RiffChunk.read(ctx));
    }

    const fmtchunk = chunks.find((v) => v.format === "fmt ")!;
    const datachunk = chunks.find((v) => v.format === "data")!;

    const format = st.read(FormatData, fmtchunk.data.buffer);
    const data = datachunk.data;

    return { format, data };
}

const file = readRiffFile(data);
console.log(file);
