# Structo

Define binary objects in zod style schemas

```ts
import * as st from "@nnilky/structo";

type Vec3 = st.InferOutput<typeof Vec3>
const Vec3 = st.object({
    x: st.f64(),
    y: st.f64(),
    z: st.f64(),
});

type Entity = st.InferOutput<typeof Entity>
const Entity = st.object({
    id: st.u64(),
    position: Vec3,
});

```

- Extremely Fast! [benchmarks](./benchmark) show equivelent performance to hand written serializers
- Designed to be both Web & Node.js compatible
- Lightweight, base size is <1KB and each datatype is a few hundred bytes
- Easily extendable with your own datatypes

Each serializer is completely seperate from the base library, meaning you only pay for what you use.

## Implementing your datatype

Implementing your own serializer is incredibly simple, heres the `f64` serializer for example

```ts
export function f64(endian: "little" | "big" = "little"): st.Serializer<number> {
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
    type: st.Serializer<T>;
    length: st.Serializer<number>;
}): st.Serializer<T[]> {
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
    st.modify(v => v * 8)
)
```

Transforms are utility that let you modify a read/written value. They allow you to processing declaratively.

### Writing your Own

Here is the `transform` transformation function, a `transform` just a function that takes a type and returns a serializer.

```ts
export function transform<T>(callback: (value: T) => T) {
    return (type: st.Serializer<T>): st.Serializer<T> => ({
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

## FaQ

- Why do I have to do `import * as st from "@nnilky/structo"`?
  - By using an `* as` import, bundles can erase the names as runtime without having to worry about runtime effects
  - additionally, by putting it under a namespace it reduces con
- Will data streaming be implemented?
  - Sadly this library isn't built for data streaming, the exposed API for serializers need the full array to be accessible
  - If you want data streaming, your going to have to fork this and re-implement the standard types
- What's the difference`
