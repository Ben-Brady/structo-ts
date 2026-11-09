# uint

Note: The `st.u64()` cannot accurately store more numbers bigger than 53 bits, if you need accuracy use `st.u64BigInt()`

- `st.u8()`
- `st.u16()`
- `st.u32()`
- `st.u64()`
- `st.u64BigInt()`

```ts
st.read(st.u8(), data)
