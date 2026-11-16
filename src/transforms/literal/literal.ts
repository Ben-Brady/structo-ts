import { st } from "../../index.ts";

/**
Will throw an error if the value isn't the exact type, uses `==` equality.

If you need to represent more than one value, use `st.enum`.

---

```ts
const header = st.object({
    version: st.literal(st.u32(), 2026)
})
```

@group Transforms
*/
export function literal<TType, const TLiteral extends TType>(
    type: st.Serializer<TType>,
    value: TLiteral,
): st.Serializer<TLiteral> {
    return st.encodeAs(type, {
        encode: (v: TLiteral) => {
            if (v !== value) throw new Error(`Invalid literal value: ${v}`);
            return v as TType;
        },
        decode: (v: TType) => {
            if (v !== value) throw new Error(`Invalid literal value: ${v}`);
            return v as TLiteral;
        },
    });
}
