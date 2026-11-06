import type { Serializer, ReaderContext } from "./types.ts";

/**
 * Reads data from an `ArrayBuffer` using a schema.
 *
 * ```ts
 * const data: ArrayBuffer = ...;
 * const schema = st.object({
 *     name: st.string(st.u8()),
 *     age: st.u32(),
 * })
 *
 * const { name, age } = st.read(schema, data)
 * ```
 */
export function read<TIn, TOut>(
    serializer: Serializer<TIn, TOut>,
    buffer: ArrayBuffer | SharedArrayBuffer,
    offset?: number,
): TOut {
    const path: (string | number)[] = [];

    const ctx: ReaderContext = {
        buffer: buffer,
        view: new DataView(buffer),
        bytes: new Uint8Array(buffer),
        offset: offset ?? 0,
        pushPath: (key) => path.push(key),
        popPath: () => path.pop(),
    };

    try {
        return serializer.read(ctx);
    } catch (e) {
        const pathStr =
            path.length === 0
                ? "root" //
                : "value" + path.map((v) => `[${v}]`).join("");
        throw new Error(`Deserialization error at serializer ${pathStr}\n${e}`, { cause: e });
    }
}
