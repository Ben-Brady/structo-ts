import type { Serializer } from "../../types.ts";

export const Void = (): Serializer<void> => ({
    size: 0,
    read: () => {},
    write: () => {},
});
