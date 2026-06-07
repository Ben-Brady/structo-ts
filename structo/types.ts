export type Serializer<T> = SerializerOnly<T> & DeserializerOnly<T>;

export type SerializerOnly<T> = {
    serialize: (ctx: SerializationContext, value: T) => void;
};
export type DeserializerOnly<T> = {
    deserialize: (ctx: DeserializationContext) => T;
};

export type SerializationContext = {
    buffer: ArrayBuffer;
    view: DataView;
    offset: number;
    requestSpace: (length: number) => void;
};
export type DeserializationContext = {
    buffer: ArrayBuffer;
    view: DataView;
    offset: number;
};

export type Infer<T> = T extends SerializerOnly<infer V> ? V : never;
