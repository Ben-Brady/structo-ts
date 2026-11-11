import * as st from "./index.ts";

type ExpectType = <T>(actual: T) => {
    toEqual: (expected: T) => void;
    toThrow: () => void;
    toMatchSnapshot?: () => void;
};

export function createTestingUtils(expect: ExpectType) {
    function assertEncodesAndDecodes<TIn, TOut>(options: {
        serializer: st.Serializer<TIn, TOut>;
        value: TIn;
        expected?: TOut;
    }) {
        const { serializer, value, expected } = options;
        const data = st.write(serializer, value);
        const newValue = st.read(serializer, data);
        expect(newValue).toEqual((expected ?? value) as unknown as TOut);
    }

    function assertEncodesAs<TIn>(options: {
        serializer: st.Serializer<TIn, any>;
        value: TIn;
        expected: number[];
    }) {
        const { serializer, value, expected } = options;
        const data = st.write(serializer, value);
        const bytes = Array.from(new Uint8Array(data));
        expect(bytes).toEqual(expected);
    }

    function assertSerializerSize<TIn, TOut>(options: {
        serializer: st.Serializer<TIn, TOut>;
        size: number | undefined;
    }) {
        const { serializer, size } = options;
        expect(serializer.size).toEqual(size);
    }

    function assertEncodesAsSize<TIn, TOut>(options: {
        serializer: st.Serializer<TIn, TOut>;
        value: TIn;
        size: number;
    }) {
        const { serializer, value, size } = options;
        const data = st.write(serializer, value);
        expect(data.byteLength).toEqual(size);
    }

    function assertEncodeThrows<TIn>(options: {
        serializer: st.Serializer<TIn, any>;
        value: TIn | unknown;
    }) {
        const { serializer, value } = options;

        //@ts-expect-error
        expect(() => st.write(serializer, value)).toThrow();
    }

    function assertMatchesSnapshot<T>(options: { serializer: st.Serializer<T>; value: T }) {
        const { serializer, value } = options;

        const data = st.write(serializer, value);
        const result = expect(data);
        if (!result.toMatchSnapshot) {
            throw new Error("Snapshot testing not supported on expect used");
        }
        result.toMatchSnapshot();
    }

    return {
        assertEncodesAndDecodes,
        assertEncodesAs,
        assertEncodesAsSize,
        assertEncodeThrows,
        assertSerializerSize,
        assertMatchesSnapshot,
    };
}
