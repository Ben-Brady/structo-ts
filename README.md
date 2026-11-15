# Structo

Use zod style schemas to serialise/deserialize binary objects

| [Repository](https://github.com/Ben-Brady/structo-ts) | [Documentation](https://ben-brady.github.io/structo-ts/) |
| - | - |

```bash
npm install @nnilky/structo
```

```ts
import { st } from "@nnilky/structo";

const User = st.object({
    name: st.string(st.u32()),
    age: st.f32(),
})

const bytes = st.write(User, { name: "foo", age: 2.3 })
const user = st.read(User, bytes)
```

- Extremely Fast! [benchmarks](./benchmark) show equivelent performance to hand written serializers
- Designed to be both Web & Node.js compatible
- Lightweight, base size is <1KB and each datatype is a few hundred bytes
- Easily extendable with your own datatypes

Each serializer is completely seperate from the base library, meaning you only pay for what you use.
