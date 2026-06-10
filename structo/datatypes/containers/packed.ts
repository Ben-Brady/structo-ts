import { Serializer } from "../../types";

export function packedBits<T extends Record<string, number>>(options: {
    size: number;
    definition: T;
}): Serializer<T> {
    const entries = Object.entries(options.definition) as [string, number][];

    return {
        write(ctx, value) {
            let output = new Uint8Array(options.size);

            let total = 0n;
            let cursor = 0;
            for (const [key, bits] of entries) {
                if (value[key] > 2 ** bits - 1) {
                    throw new Error(`key "${key}" was too large`);
                }
                cursor += bits;
                const shift = BigInt(options.size * 8 - cursor);
                const entry = BigInt(value[key]);

                total += entry << shift;
            }

            for (let i = 0; i < output.length; i++) {
                output[i] = Number((total >> BigInt(i)) & 255n);
            }

            new Uint8Array(ctx.buffer).set(output, ctx.offset);
            ctx.offset += options.size;
        },
        read(ctx) {
            const slice = ctx.buffer.slice(ctx.offset, ctx.offset + options.size);
            const data = new Uint8Array(slice).toReversed();
            ctx.offset += options.size;

            let total = 0n;
            for (let i = 0; i < data.length; i++) {
                const byte = BigInt(data[i]);
                total += byte << BigInt(i);
            }

            const obj: Record<string, number> = {};
            let cursor = 0;
            for (const [key, bits] of entries) {
                const shift = BigInt(2 ** options.size - cursor);
                const mask = BigInt(2 ** bits - 1);
                const entry = Number((total >> shift) & mask);
                obj[key] = entry;
                cursor += bits;
            }

            return obj as T;
        },
    };
}
