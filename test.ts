export type Read = (length: number) => Uint8Array;
export type Write = (data: Uint8Array) => void;
export type Serializer<T> = {
    serialize?: (write: Write) => T;
    deserialize?: (read: Read) => T;
};

export type Infer<T> = T extends Serializer<infer V> ? V : never;
type InferObject<T> = T extends Record<string, Serializer<any>>
    ? {
          [Key in keyof T]: Infer<T[Key]>;
      }
    : never;

export function u8(): Serializer<number> {
    return {
        deserialize(read) {
            return read(1)[0];
        },
    };
}

export function object<T extends Record<string, Serializer<any>>>(
    definition: T,
): Serializer<InferObject<T>> {
    const entries = Object.entries(definition);
    return {
        deserialize: (read: Read) => {
            const obj: Record<string, unknown> = {};
            for (const [key, serializer] of entries) {
                obj[key] = serializer.deserialize!(read);
            }
            return obj as InferObject<T>;
        },
    };
}

function serialize<T>(serializer: Serializer<T>, value: T): Uint8Array {
    const array = [];
}
const st = { u8, object };

type User = Infer<typeof User>;
const User = st.object({
    name: st.u8(),
    age: st.u8(),
});
// meow
