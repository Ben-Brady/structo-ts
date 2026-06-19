import { write } from "node:fs";
import type { Serializer } from "../types";

/**
 * createReference lets you defer writing a value until later, useful for lengths and sizes
 *
 * ---
 * ```
 * const length = st.createReference<number>()
 * st.object({
 *   length: length.pointer(st.u32()),
 *   type: st.u8(),
 *   data: st.sizedBytes(length.deref())
 * })
 * ```
 */
export function createReference<T>() {
    const readStack: T[] = [];
    const writeStack: {
        offset: number;
        serializer: Serializer<T>;
    }[] = [];

    /**
     * When reading: reads the value normal and saves it for later
     *
     * When writing: omits this value, it is written by deref
     *
     * ---
     * ```
     * const length = st.createReference<number>()
     * st.object({
     *   length: length.pointer(st.u32()),
     *   type: st.u8(),
     *   data: st.sizedBytes(length.deref())
     * })
     * ```
     */
    function pointer(serializer: Serializer<T>): Serializer<T> {
        const size = serializer.size;
        if (size === undefined) throw new Error("Serializer must be sized");

        return {
            size,
            read: (ctx) => {
                const value = serializer.read(ctx);
                readStack.push(value);
                return value;
            },
            write: (ctx, value) => {
                writeStack.push({
                    offset: ctx.offset,
                    serializer,
                });
                ctx.offset += size;
                return value;
            },
        };
    }

    /**
     * When reading: gets the value stored in pointer
     *
     * When writing: saves the value into the pointer
     *
     * By default the value is removed from the pointer,
     * but you can retain it to ensure the next value is
     *
     * ---
     * ```
     * const length = st.createReference<number>()
     * st.object({
     *   length: length.pointer(st.u32()),
     *   type: st.u8(),
     *   data: st.sizedBytes(length.deref())
     * })
     * ```
     */
    function deref(): Serializer<T> {
        return {
            size: 0,
            read: () => {
                if (readStack.length === 0) throw new Error("Read Stack Empty");
                return readStack.pop()!;
            },
            write: (ctx, value) => {
                if (writeStack.length === 0) throw new Error("Write Stack is emtpy");

                const { offset, serializer } = writeStack.pop()!;
                const start = ctx.offset;
                ctx.offset = offset;
                serializer.write(ctx, value);
                ctx.offset = start;
            },
        };
    }

    return { pointer, deref };
}
