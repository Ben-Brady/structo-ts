## `st.writeInto`

If you wanna write into an existing buffer (such as with WASM and WebGL/WebGPU) you can use `st.writeInto`

```ts
const buffer = new ArrayBuffer(1024)

let offset = 0
offset += st.writeInto(buffer, offset, User, {
    name: "nnilky",
    age: 23.1,
})
offset += st.writeInto(buffer, offset, User, {
    name: "Ben Brady",
    age: 23.6
})
```

For more information see the [st.writeInto documentation](/functions/index.writeInto.html)

## Implementing your datatype

Implementing your own serializer is incredibly simple, heres the `f64` serializer for example

```ts
export function f64(endian: "little" | "big" = "little"): st.Serializer<number> {
    return {
        size: 8,
        write: (ctx, value) => {
            ctx.reserve(8);
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
