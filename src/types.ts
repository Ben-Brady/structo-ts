export type Serializer<TIn, TOut = TIn> = {
    size?: number | undefined;
    write: (ctx: WriterContext, value: TIn) => void;
    read: (ctx: ReaderContext) => TOut;
};

export type SerializationContext = WriterContext | ReaderContext;

export interface WriterContext<
    TBuffer extends ArrayBuffer | SharedArrayBuffer = ArrayBuffer | SharedArrayBuffer,
> {
    offset: number;
    buffer: TBuffer;
    view: DataView;
    bytes: Uint8Array;
    reserve: (length: number) => void;

    pushPath?: (key: string | number) => void;
    popPath?: () => void;
}

export interface ReaderContext<
    TBuffer extends ArrayBuffer | SharedArrayBuffer = ArrayBuffer | SharedArrayBuffer,
> {
    offset: number;
    buffer: TBuffer;
    view: DataView;
    bytes: Uint8Array;

    pushPath?: (key: string | number) => void;
    popPath?: () => void;
}

export type InferInput<T extends Serializer<any>> = T extends Serializer<infer V> ? V : never;
export type InferOutput<T extends Serializer<any>> = T extends Serializer<infer V> ? V : never;
