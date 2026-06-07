import type { Serializer, ReaderContext } from "./types";

export function read<T>(serializer: Serializer<T>, buffer: ArrayBuffer): T {
    return serializer.read(createReaderContext(buffer));
}

export function createReaderContext(buffer: ArrayBuffer) {
    return {
        offset: 0,
        buffer,
        view: new DataView(buffer),
    };
}
