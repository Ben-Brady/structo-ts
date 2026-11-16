import { st } from "../../index.ts";

/**
Will throw an error if the value isn't found within the values array, uses `==` equality.

If you need to represent only one value, use `st.literal`.

---

```ts
const header = st.object({
    version: st.enum(st.u32(), [2022, 2025, 2026])
})
```

@group Utilities
*/
function enum_<TType, const TLiteral extends TType>(
    type: st.Serializer<TType>,
    values: TLiteral[],
): st.Serializer<TLiteral> {
    return st.encodeAs(type, {
        encode: (v: TLiteral) => {
            if (!values.includes(v)) throw new Error(`Invalid enum variant: ${v}`);
            return v as TType;
        },
        decode: (v: TType) => {
            if (!values.includes(v as TLiteral)) throw new Error(`Invalid enum variant: ${v}`);
            return v as TLiteral;
        },
    });
}

export { enum_ as enum };
