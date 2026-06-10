export type Serializer<T> = SerializerOnly<T> & DeserializerOnly<T>;

type SerializerOnly<T> = {
    write: (ctx: WriterContext, value: T) => void;
};
type DeserializerOnly<T> = {
    read: (ctx: ReaderContext) => T;
};

export interface WriterContext {
    buffer: ArrayBuffer;
    view: DataView;
    offset: number;
    requestSpace: (length: number) => void;
}
export interface ReaderContext {
    buffer: ArrayBuffer;
    view: DataView;
    offset: number;
}

export type Infer<T> = T extends SerializerOnly<infer V> ? V : never;
