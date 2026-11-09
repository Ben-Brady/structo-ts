import type { Serializer } from "../../types.ts";

/**
 * A zero sized type that reads as undefined, reading and writing is a noop
 *
 * This is useful for a few edge cases such as empty union cases
 *
 * ---
 * ```ts
 * st.Void()
 * ```
 * @group Utilities
 */
export const Void = (): Serializer<unknown, undefined> => ({
    size: 0,
    read: () => undefined,
    write: () => {},
});
