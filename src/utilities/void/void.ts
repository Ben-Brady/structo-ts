import type { st } from "../../index.ts";

/**
 * A zero sized type that reads as undefined, reading and writing is a noop
 *
 * This is useful for a few edge cases such as empty union cases
 *
 * ---
 * ```ts
 * st.void()
 * ```
 * @group Utilities
 */
const Void = (): st.Serializer<undefined> => ({
    size: 0,
    read: () => undefined,
    write: () => {},
});

export { Void as void };
