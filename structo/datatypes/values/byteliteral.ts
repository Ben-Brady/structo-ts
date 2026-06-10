import { Serializer } from "../types";

export function byteLiteral(instance: number[]): Serializer<number[]> {
    const length = instance.length;

    return {
        read(ctx) {
            const arr = new Uint8Array(ctx.view.buffer);

            for (let i = 0; i < length; i++) {
                if (arr[ctx.offset + i] !== instance[i]) {
                    throw new Error("Invalid Value");
                }
            }
            ctx.offset += length;
            return instance;
        },
        write(ctx) {
            new Uint8Array(ctx.view.buffer).set(instance, ctx.offset);
            ctx.offset += length;
        },
    };
}
