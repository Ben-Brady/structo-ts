# Structo

Define binary objects in zod style schemas

```ts
import * as st from "../../structo";

const Entity = st.object({
    rotation: st.f64(),
    y: st.f64(),
    z: st.f64(),
});

const Vec3 = st.object({
    x: st.f64(),
    y: st.f64(),
    z: st.f64(),
});
```

- Incredibly lightweight, base size is <1KB and each datatype is a few hundred bytes
- Supports Web/Node.js compatible
- Easily implemented

Each serializer is completely seperate from the base library, meaning you only pay for what you use.

## Implementing your own Serializer

Implementing your own serializer is incredibly simple, heres the `f64` serializer for example

```ts
export function f64(endian: "little" | "big" = "little"): Serializer<number> {
    return {
        size: 8,
        write: (ctx, value) => {
            ctx.alloc(8);
            ctx.view.setFloat64(ctx.offset, value, endian === "little");
            ctx.offset += 8;
        },
        read: (ctx) => {
            const value = ctx.view.getFloat64(ctx.offset, endian === "little");
            ctx.offset += 8;
            return value;
        },
    };
}
```

The `alloc()` in the write function is a utility provided to you to ensure you have enough space ahead of you in the buffer to write to.

When reading and writing, you must increment the `ctx.offset` so the next value can be read from. However,

The `size` attribute is optional, but if included can be used to do allocations in advance.

> Important: You must modify the ctx object, do not spread over it since this will break the reference

### Container Example

Here is the list serializer

```ts
export function list<T>(options: {
    type: Serializer<T>;
    length: Serializer<number>;
}): Serializer<T[]> {
    const lengthType = options.length;
    const valueType = options.type;

    return {
        write: (ctx, value) => {
            lengthType.write(ctx, value.length);
            for (const v of value) {
                lengthType.write(ctx, v);
            }
        },
        read: (ctx) => {
            const size = lengthType.read(ctx);

            const arr = []
            for (let i = 0; i < size; i++) {
                arr.push(valueType.read(ctx))
            }
            return arr;
        },
    };
}
```

## Transforms

```ts
const Bits = st.pipe(
    st.u32()
    st.transform(v => v * 8)
)
```

Transforms are utility that let you modify a read/written value. They allow you to processing declaratively.

### Writing your Own

Here is the `transform` transformation function, a `transform` just a function that takes a type and returns a serializer.

```ts
export function transform<T>(callback: (value: T) => T) {
    return (type: Serializer<T>): Serializer<T> => ({
        size: type.size,
        read: (ctx) => {
            const value = type.read(ctx);
            return callback(value);
        },
        write: (ctx, value) => {
            let outValue = callback(value);
            type.write(ctx, outValue);
        },
    });
}
```
