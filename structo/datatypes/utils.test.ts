import { describe, it, expect } from "bun:test";
import * as st from "../index";

export const randint = (start: number, end: number) => {
    const range = end - start;
    return Math.floor(start + range * Math.random());
};

export const randbigint = (start: bigint, end: bigint) => {
    const range = end - start;
    const offset = BigInt(Math.floor(Number(range) * Math.random()));

    return start + offset;
};

export const expectEncode = <T>(serializer: st.Serializer<T>, value: T) => {
    const data = st.serialize(serializer, value);
    const newValue = st.deserialize(serializer, data);
    expect(value).toEqual(newValue);
};

export const expectError = (callback: () => void) => {
    try {
        callback();
    } catch {
        return;
    }
    throw new Error("Expected Error");
};
