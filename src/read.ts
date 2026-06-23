import type { Serializer, ReaderContext } from "./types.js";

export function read<TIn, TOut>(
    serializer: Serializer<TIn, TOut>,
    buffer: ArrayBuffer | SharedArrayBuffer,
    offset?: number,
): TOut {
    const ctx: ReaderContext = {
        buffer: buffer,
        view: new DataView(buffer),
        bytes: new Uint8Array(buffer),
        path: [],
        offset: offset ?? 0,
    };
    try {
        return serializer.read(ctx);
    } catch (e) {
        const path = ctx.path.join("") ?? "root";
        throw new Error(`Deserialization error at serializer${path}\n${e}`, { cause: e });
    }
}
