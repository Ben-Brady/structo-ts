import type { Serializer } from "../types";

/**
 * createRememberedValue lets you save and recall a value when serializing
 *
 * ```
 * const length = st.createRememberedValue<number>()
 * st.object({
 *   length: length.save(st.u32()),
 *   type: st.u8(),
 *   data: st.sizedBytes(length.load())
 * })
 * ```
 */
export function createRememberedValue<T>() {
    const stack: T[] = [];

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

    function load(): Serializer<T> {
        return {
            size: 0,
            read: () => stack.pop()!,
            write: () => {},
        };
    }

    return { save: save, load: load };
}
