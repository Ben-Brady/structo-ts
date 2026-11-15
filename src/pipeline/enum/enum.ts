import { st } from "../../index.ts";

/**
Will throw an error if the value isn't found within the values array, uses `==` equality.

If you need to represent only one value, use `st.literal`.

---

```ts
const header = st.object({
    version: st.pipe(st.u32(), st.enum([2022, 2025, 2026]))
})
```

@group Pipeline
*/
export function enum_<const T>(values: T[]) {
    // Note: We have to use any here instead of T
    // because when T = 0 | 1 | 2, then T != number
    // so we use any as an excape hatch :torment:
    return st.encode<T, any>({
        encode: (v) => {
            if (!values.includes(v)) throw new Error(`Invalid enum variant: ${v}`);
            return v;
        },
        decode: (v) => {
            if (!values.includes(v)) throw new Error(`Invalid enum variant: ${v}`);
            return v;
        },
    });
}

export { enum_ as enum };
