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
    const data = st.write(serializer, value);
    const newValue = st.read(serializer, data);
    expect(value).toEqual(newValue);
};

export const expectEncodeSnapshot = <T>(serializer: st.Serializer<T>, value: T) => {
    const data = st.write(serializer, value);
    expect(data).toMatchSnapshot();
};

export const expectError = (callback: () => void) => {
    try {
        callback();
    } catch {
        return;
    }
    throw new Error("Expected Error");
};

export const bytes = (bytes: number[]) => {
    return new Uint8Array(bytes).buffer;
};
