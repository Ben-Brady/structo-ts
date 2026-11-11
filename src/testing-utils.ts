import * as st from "./index.ts";

type ExpectType = <T>(actual: T) => {
    toEqual: (expected: T) => void;
    toMatchSnapshot?: () => void;
};

export function createTestingUtils(expect: ExpectType) {
    function assertEncodesAndDecodes<TIn, TOut>(
        serializer: st.Serializer<TIn, TOut>,
        value: TIn,
        expected?: TOut,
    ) {
        const data = st.write(serializer, value);
        const newValue = st.read(serializer, data);
        expect(newValue).toEqual((expected ?? value) as unknown as TOut);
    }

    function assertEncodesAs<TIn>(
        serializer: st.Serializer<TIn, any>,
        value: TIn,
        expected: number[],
    ) {
        const data = st.write(serializer, value);
        const bytes = Array.from(new Uint8Array(data));
        expect(bytes).toEqual(expected);
    }

    function assertEncodeThrows<TIn>(serializer: st.Serializer<TIn, any>, value: TIn) {
        try {
            st.write(serializer, value);
        } catch {
            return;
        }
        throw new Error("Didn't throw");
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

    function assertMatchesSnapshot<T>(serializer: st.Serializer<T>, value: T) {
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
        assertMatchesSnapshot,
    };
}
