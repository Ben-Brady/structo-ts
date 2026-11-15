import type { st } from "../../index.ts";

/**

Lets you generate an encoder transform by providing a encode and decode function

- `decode` is done when reading
- `encode` is done when writing

---

```ts
export function asHex(type: st.Serializer<Uint8Array>) {
    return encode(type, {
        encode: (v) => Uint8Array.fromHex(v),
        decode: (v) => v.toHex().toUpperCase(),
    });
}

asHex(st.bytes(st.u32()))
```

@group Transforms
*/
export function encode<TIn, TOut>(
    type: st.Serializer<TOut>,
    options: {
        encode: (value: TIn) => TOut;
        decode: (value: TOut) => TIn;
    },
): st.Serializer<TIn> {
    const { encode, decode } = options;
    return {
        size: type.size,
        read: (ctx) => decode(type.read(ctx)),
        write: (ctx, value) => type.write(ctx, encode(value)),
    };
}
