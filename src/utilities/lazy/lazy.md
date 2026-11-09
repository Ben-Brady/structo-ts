# Lazy

`st.lazy` lets you access schemas that are later defined to allow you to order your defintions in any order.

```ts
const Player = st.object({
    id: st.u32(),
    position: st.lazy(() => Vec3), // closure allows Vec3 to be hoisted
})

const Vec3 = st.object({
    x: st.f32(),
    y: st.f32(),
    z: st.f32(),
})
```

## Implementation

This works underhood by delaying initalisation until something tries to serialize for first time. This means that this code won't work

```ts
const Player = st.object({
    id: st.u32(),
    position: st.lazy(() => Vec3),
})

// ❌ Vec3 hasn't been defined
st.write(Player, { ... })

// ❌ .size is resolved, but Vec3 hasn't been defined
if (Player.size === 0) {
    throw new Error("Player must be sized")
}

const Vec3 = st.object({
    x: st.f32(),
    y: st.f32(),
    z: st.f32(),
})
```
