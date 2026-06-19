//@ts-ignore TODO
import { describe, it, expect } from "bun:test";
import * as st from "./index.js";

export const randint = (start: number, end: number) => {
    const range = end - start;
    return Math.floor(start + range * Math.random());
};

export const randbigint = (start: bigint, end: bigint) => {
    const range = end - start;
    const offset = BigInt(Math.floor(Number(range) * Math.random()));

    return start + offset;
};

export const encodeTest = <TIn, TOut>(
    serializer: st.Serializer<TIn, TOut>,
    value: TIn,
    expected?: TOut,
) => {
    const data = st.write(serializer, value);
    const newValue = st.read(serializer, data);
    expect(newValue).toEqual((expected ?? value) as unknown as TOut);
};

export const encodeFailTest = <TIn, TOut>(serializer: st.Serializer<TIn, TOut>, value: TIn) => {
    expectError(() => {
        st.write(serializer, value);
    });
};

export const expectEncodeSize = <TIn, TOut>(
    serializer: st.Serializer<TIn, TOut>,
    size: number,
    value: TIn,
) => {
    const data = st.write(serializer, value);
    expect(data.byteLength).toEqual(size);
};

export const encodeSnapshotTest = <T>(serializer: st.Serializer<T>, value: T) => {
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
