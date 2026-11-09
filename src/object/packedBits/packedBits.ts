import type { Serializer } from "../../types.ts";
import { assertInRange } from "../../helpers.ts";

const objEntries = Object.entries as <TKey extends string, TVal>(
    object: Record<TKey, TVal>,
) => [TKey, TVal][];

/**
 * **Experimental**: May undergo API changes in future versions, but the bit representation will not change
 *
 * `st.packedBits` is a way to pack integers smaller than a byte, allowing you to pack data or bit flags into less bytes
 *
 * The values are encoded in the smallest little endian bytes possible to fit the bits
 *
 * ```ts
 * st.packedBits({
 *     id: {bits: 13},
 *     age: {bits: 11},
 *     createdAt: {bits: 16},
 * })
 * ```
 *
 * @group Object
 */
export function packedBits<T extends string>(
    definition: Record<T, { bits: number }>,
): Serializer<Record<T, number>> {
    const entries = objEntries(definition);

    let bitsize = 0;
    for (const [_, { bits }] of entries) {
        if (bits > 51) throw new Error("Cannot store more bits than a double can store");
        bitsize += bits;
    }

    const size = Math.ceil(bitsize / 8);

    return {
        size,
        write: (ctx, value) => {
            if (size === 0) return;

            let bytesString = "";
            for (const [key, { bits }] of entries) {
                ctx.pushPath?.(key);
                const keyValue = BigInt(value[key]);
                assertInRange(keyValue, 0n, BigInt(2 ** bits));
                bytesString += keyValue.toString(2).padStart(bits, "0");
                ctx.popPath?.();
            }

            ctx.reserve(size);
            for (let i = 0; i < size; i++) {
                const byteString = bytesString.slice(i * 8, (i + 1) * 8).padEnd(8, "0");
                const byte = parseInt(byteString, 2);
                ctx.bytes[ctx.offset] = byte;
                ctx.offset += 1;
            }
        },
        read: (ctx) => {
            if (size === 0) return {} as Record<T, number>;

            const bytes = Array.from(ctx.bytes.slice(ctx.offset, ctx.offset + size));
            ctx.offset += size;

            const bytesString = bytes.map((v) => v.toString(2).padStart(8, "0")).join("");

            const output = {} as Record<T, number>;
            let offset = 0;
            for (const [key, { bits }] of entries) {
                const byteString = bytesString.slice(offset, offset + bits);
                offset += bits;
                output[key] = parseInt(byteString, 2);
            }
            return output;
        },
    };
}
