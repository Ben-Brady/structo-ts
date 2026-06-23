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
    path: string[];
    reserve: (length: number) => void;
}

export interface ReaderContext<
    TBuffer extends ArrayBuffer | SharedArrayBuffer = ArrayBuffer | SharedArrayBuffer,
> {
    offset: number;
    buffer: TBuffer;
    view: DataView;
    bytes: Uint8Array;
    path: string[];
}

export type InferInput<T> = T extends Serializer<infer V> ? V : never;
export type InferOutput<T> = T extends Serializer<any, infer V> ? V : never;
