import type { Serializer } from "../types.js";

/**
 * createRememberedValue lets you save and recall a value when serializing
 *
 * This is useful for checksums and other values calculated from a writen value
 *
 * ```
 * const data = st.createRememberedValue<Uint8Array>()
 * st.object({
 *   data: data.save(st.bytes(1024))
 *   checksum: crc32(data.load())
 * })
 * ```
 */
export function createRememberedValue<T>() {
    const stack: T[] = [];

    /**
     * Transparently writes/reads the underlying value but stores the value written.
     *
     * ---
     * ```
     * const data = st.createRememberedValue<Uint8Array>()
     * st.object({
     *   data: data.save(st.bytes(1024))
     *   checksum: crc32(data.load())
     * })
     * ```
     * */
    function save(serializer: Serializer<T>): Serializer<T> {
        return {
            size: serializer.size,
            read: (ctx) => {
                const value = serializer.read(ctx);
                stack.push(value);
                return value;
            },
            write: (ctx, value) => {
                serializer.write(ctx, value);
                stack.push(value);
                return value;
            },
        };
    }

    /**
     * Retrieves the last value written by `.save()`
     *
     * By default, the value is forgotten when written so that memory isn't leaked.
     * It can be retained by setting `behaviour` to `"retain"`
     *
     * When writing this type does nothing
     *
     * ---
     * ```
     * const data = st.createRememberedValue<Uint8Array>()
     * st.object({
     *   data: data.save(st.bytes(1024))
     *   checksum: crc32(data.load())
     * })
     * ```
     */
    function load(behaviour: "pop" | "retain" = "pop"): Serializer<T> {
        return {
            size: 0,
            read: () => {
                if (behaviour === "pop") {
                    return stack.pop()!;
                } else {
                    return stack.at(-1)!;
                }
            },
            write: () => {},
        };
    }

    return { save: save, load: load };
}
