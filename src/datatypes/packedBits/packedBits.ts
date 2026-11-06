import type { Serializer } from "../../types.ts";

type BitDefintion = { bits: number };

type ObjectEntries = <TKey extends string, TVal>(object: Record<TKey, TVal>) => [TKey, TVal][];
type ObjectValues = <TVal>(object: Record<any, TVal>) => TVal[];

const objEntries = Object.entries as ObjectEntries;
const objValues = Object.values as ObjectValues;

/**
 * `st.packedBits` is a way to pack integers smaller than a byte, allowing you to pack data or bit flags into less bytes
 *
 * The values are encoded in the smallest little endian bytes possible to fit the bits
 *
 *
 * ```ts
 * st.packedBits({
 *     id: {bits: 13},
 *     age: {bits: 11},
 *     createdAt: {bits: 16},
 * })
 * ```
 */
export function packedBits<T extends string>(
    definition: Record<T, BitDefintion>,
): Serializer<Record<T, number>> {
    const entries = objEntries(definition);
    const bitsize = objValues(definition)
        .map((v) => v.bits)
        .reduce((a, b) => a + b, 0);
    const size = Math.ceil(bitsize / 8);

    return {
        size,
        write: (ctx, value) => {
            if (size === 0) return;
            ctx.reserve(size);

            let output = 0n;
            let offset = 0n;
            for (const [key, { bits }] of entries) {
                ctx.pushPath?.(key);
                const fieldValue = BigInt(value[key]);

                let maxValue = 2 ** bits - 1;
                if (fieldValue < 0) {
                    throw new Error("Cannot serialize negative values");
                }
                if (fieldValue > maxValue) {
                    throw new Error(`${key} exceed max value, ${fieldValue} > ${maxValue}`);
                }

                output += fieldValue << offset;
                offset += BigInt(bits);
                ctx.popPath?.();
            }

            ctx.reserve(size);
            for (let i = 0; i < size; i++) {
                ctx.bytes[ctx.offset] = Number(output & 255n);
                ctx.offset += 1;
                output >>= 8n;
            }
        },
        read: (ctx) => {
            if (size === 0) return {} as Record<T, number>;
            const bytes = Array.from(ctx.bytes.slice(ctx.offset, ctx.offset + size));
            ctx.offset += size;

            const integer = bytes
                .map((v, i) => BigInt(v) << (BigInt(i) * 8n))
                .reduce((a, b) => a + b);

            const output = {} as Record<T, number>;
            let offset = 0n;
            for (const [key, { bits }] of entries) {
                let mask = (1n << BigInt(bits)) - 1n;
                let value = (integer >> offset) & BigInt(mask);
                offset += BigInt(bits);
                output[key] = Number(value);
            }

            return output;
        },
    };
}
