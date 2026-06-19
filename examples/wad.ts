import * as st from "../src";

const WadFile = st.lazy(() =>
    st.object({
        header: Header,
        lumps: Directory,
    }),
);

const lumpsCount = st.createReference<number>();
const directoryOffset = st.createReference<number>();
const Header = st.object({
    id: st.pipe(
        st.bytes(4),
        st.toAscii(),
        st.enum(["IWAD", "PWAD"]), //
    ),
    numLumps: lumpsCount.pointer(st.s32()),
    directoryOffset: directoryOffset.pointer(st.s32()),
});

const Directory = st.lazy(() =>
    st.pipe(
        st.list(lumpsCount.deref(), Lump), //
        st.offset("absolute", directoryOffset.deref()),
    ),
);

const lumpPosition = st.createReference<number>();
const lumpSize = st.createReference<number>();
const Lump = st.lazy(() =>
    st.object({
        position: lumpPosition.pointer(st.s32()),
        size: lumpSize.pointer(st.s32()),
        name: st.pipe(st.bytes(8), st.toAscii()),
        data: st.pipe(
            st.sizedBytes(lumpSize.deref()), //
            st.offset("absolute", lumpPosition.deref()),
        ),
    }),
);

//@ts-ignore TODO
import { readFileSync } from "node:fs";
const path = import.meta.resolve("./data/DOOM.WAD").replace("file://", "");
const data = readFileSync(path).buffer;

const wad = st.read(WadFile, data);
for (const lump of wad.lumps) {
    console.log(`${lump.name}`);
}
