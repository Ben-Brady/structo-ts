import type { Serializer, ReaderContext } from "./types";

export function read<TIn, TOut>(serializer: Serializer<TIn, TOut>, buffer: ArrayBuffer): TOut {
    const ctx = createReaderContext(buffer);
    try {
        return serializer.read(ctx);
    } catch (e) {
        const path = ctx.stack.join("") ?? "root";
        throw new Error(`Deserialization error at serializer${path}`, { cause: e });
    }
}

export function createReaderContext(buffer: ArrayBuffer): ReaderContext {
    return {
        stack: [],
        offset: 0,
        buffer,
        view: new DataView(buffer),
    };
}
