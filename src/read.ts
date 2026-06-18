import type { Serializer } from "./types";

export function read<TIn, TOut>(serializer: Serializer<TIn, TOut>, buffer: ArrayBuffer): TOut {
    return serializer.read(createReaderContext(buffer));
}

export function createReaderContext(buffer: ArrayBuffer) {
    return {
        offset: 0,
        buffer,
        view: new DataView(buffer),
    };
}
