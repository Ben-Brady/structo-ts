import type { Pipeline } from "../../pipeline/pipe.ts";

/**

Lets you generate an encoder transform by providing a encode and decode function

- `decode` is done when reading
- `encode` is done when writing

---

```ts
export function toHex() {
    return encode<string, Uint8Array>({
        encode: (v) => Uint8Array.fromHex(v),
        decode: (v) => v.toHex().toUpperCase(),
    });
}
```

@group Transforms
*/
export function encode<TIn, TOut>(options: {
    encode: (value: TIn) => TOut;
    decode: (value: TOut) => TIn;
}): Pipeline<TIn, TOut> {
    const { encode, decode } = options;
    return (type) => ({
        size: type.size,
        read: (ctx) => decode(type.read(ctx)),
        write: (ctx, value) => type.write(ctx, encode(value)),
    });
}
