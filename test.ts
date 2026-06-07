import * as st from "./structo";

type User = st.Infer<typeof User>;
const User = st.object({
    foo: st.u8(),
    age: st.u16(),
    username: st.string({ length: st.u8() }),
});

const data = st.serialize(User, {
    foo: 1,
    age: 258,
    username: "foo",
});

console.log(data);
console.log(st.deserialize(User, data));
