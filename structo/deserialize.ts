import type { DeserializerOnly, DeserializationContext } from "./types";

export function deserialize<T>(serializer: DeserializerOnly<T>, buffer: ArrayBuffer): T {
    const ctx: DeserializationContext = {
        offset: 0,
        buffer,
        view: new DataView(buffer),
    };
    return serializer.deserialize(ctx);
}
