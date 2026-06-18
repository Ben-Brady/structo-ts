export type Serializer<TIn, TOut = TIn> = {
    size?: number | undefined;
    write: (ctx: WriterContext, value: TIn) => void;
    read: (ctx: ReaderContext) => TOut;
};

export interface WriterContext {
    buffer: ArrayBuffer;
    view: DataView;
    offset: number;
    alloc: (length: number) => void;
}

export interface ReaderContext {
    buffer: ArrayBuffer;
    view: DataView;
    offset: number;
}

export type InferInput<T> = T extends Serializer<infer V> ? V : never;
export type InferOutput<T> = T extends Serializer<any, infer V> ? V : never;
