import { st } from "../../index.ts";

/**
Will throw an error if the value isn't the exact type, uses `==` equality.

If you need to represent more than one value, use `st.enum`.

---

```ts
const header = st.object({
    version: st.pipe(st.u32(), st.literal(2026))
})
```

@group Pipeline
*/
export function literal<const T>(value: T) {
    return st.encode<T, any>({
        encode: (v) => {
            if (v !== value) throw new Error(`Invalid literal value: ${v}`);
            return v;
        },
        decode: (v) => {
            if (v !== value) throw new Error(`Invalid literal value: ${v}`);
            return v;
        },
    });
}
