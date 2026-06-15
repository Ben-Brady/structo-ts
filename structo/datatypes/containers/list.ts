import type { Serializer } from "../../types";


export function list<T>(options: {
    type: Serializer<T>;
    length: Serializer<number>;
}): Serializer<T[]> {
    const { read: readLength, write: writeLength } = options.length;
    const { read: readType, write: writeType, size: sizeType } = options.type;

    return {
        write: (ctx, value) => {
            writeLength(ctx, value.length);

            if (sizeType) ctx.alloc(value.length * sizeType);
            for (const v of value) {
                writeType(ctx, v);
            }
        },
        read: (ctx) => {
            const size = readLength(ctx);

            const arr = new Array(size);
            for (let i = 0; i < size; i++) {
                arr[i] = readType(ctx);
            }
            return arr;
        },
    };
}
