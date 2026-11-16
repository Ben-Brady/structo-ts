# Structo

Use zod style schemas to serialize/deserialize binary objects

| [Repository](https://github.com/Ben-Brady/structo-ts) | [Documentation](https://ben-brady.github.io/structo-ts/) |
| - | - |

```bash
npm install @nnilky/structo
```

```ts
import { st } from "@nnilky/structo";

const File = st.object({
    filename: st.string(st.u16()),
    createdAt: st.asDate(st.u64()),
    data: st.bytes(st.u64()),
})

const bytes = st.write(File, {
    filename "image.png",
    age: Date.now(),
    data: fs.readFileSync("./image.png").buffer,
})
// later on
const { filename, createdAt, data } = st.read(File, packetData)
```

- Both Web & Node.js/Bun compatible
- Extremely Fast! [benchmarks](./benchmark) show only 30% slower than hand written serializers
- Lightweight, base size is <1KB and each datatype is a few hundred bytes
- Easily extendable with your own custom datatypes

Each serializer is completely seperate from the base library, meaning you only pay for what you use.

Additionally you can extend the feature set with different views and data types.
