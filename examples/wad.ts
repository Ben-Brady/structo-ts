import { st } from "../src";

const WadFile = st.lazy(() =>
    st.object({
        header: Header,
        lumps: Directory,
    }),
);

const lumpsCount = st.createReference<number>();
const directoryOffset = st.createReference<number>();
const Header = st.object({
    id: st.enum(st.asAscii(st.fixedBytes(4)), ["IWAD", "PWAD"]),
    numLumps: lumpsCount.pointer(st.s32()),
    directoryOffset: directoryOffset.pointer(st.s32()),
});

const Directory = st.lazy(() =>
    st.offset(
        st.array(lumpsCount.deref(), Lump), //
        "absolute",
        directoryOffset.deref(),
    ),
);

const lumpPosition = st.createReference<number>();
const lumpSize = st.createReference<number>();
const Lump = st.lazy(() =>
    st.object({
        position: lumpPosition.pointer(st.s32()),
        size: lumpSize.pointer(st.s32()),
        name: st.asAscii(st.fixedBytes(8)),
        data: st.offset(st.bytes(lumpSize.deref()), "absolute", lumpPosition.deref()),
    }),
);

//@ts-expect-error node import
import { readFileSync } from "node:fs";
const path = import.meta.resolve("./data/31plats.wad").replace("file://", "");
const data = readFileSync(path).buffer;

const wad = st.read(WadFile, data);
for (const lump of wad.lumps) {
    const size = `${(lump.size / 1024).toFixed(1)}kb`;
    console.log(`${size} @${lump.position.toString().padEnd(5)} - ${lump.name}`);
}
