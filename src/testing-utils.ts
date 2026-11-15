import { st } from "./index.ts";

type ExpectType = <T>(actual: T) => {
    toBe: (expected: T) => void;
    toEqual: (expected: T) => void;
    toThrow: () => void;
    toMatchSnapshot?: () => void;
};

/**
 * A set of testing utils used to test custom serializers, it is used internally as well
 *
 * @param expect A jest-like expect function, this is passed in to allow use of different testing frameworks.
 */
export function createTestingUtils(expect: ExpectType) {
    function readWrite<T>(options: { serializer: st.Serializer<T>; value: NoInfer<T> }) {
        const { serializer, value } = options;
        const data = st.write(serializer, value);
        return st.read(serializer, data);
    }

    function assertEncodesAndDecodes<T>(options: {
        serializer: st.Serializer<T>;
        value: NoInfer<T>;
        expected?: NoInfer<T>;
    }) {
        const { serializer, value, expected } = options;
        const data = st.write(serializer, value);
        const newValue = st.read(serializer, data);
        expect(newValue).toEqual((expected ?? value) as unknown as T);
    }

    function assertEncodesAs<T>(options: {
        serializer: st.Serializer<T>;
        value: NoInfer<T>;
        expected: number[] | Uint8Array;
    }) {
        const { serializer, value, expected } = options;
        const data = st.write(serializer, value);
        const bytes = Array.from(new Uint8Array(data));
        expect(bytes).toEqual(Array.from(expected));
    }

    function assertSerializerSize<T>(options: {
        serializer: st.Serializer<T>;
        size: number | undefined;
    }) {
        const { serializer, size } = options;
        expect(serializer.size).toBe(size);
    }

    function assertEncodesAsSize<T>(options: {
        serializer: st.Serializer<T>;
        value: NoInfer<T>;
        size: number;
    }) {
        const { serializer, value, size } = options;
        const data = st.write(serializer, value);
        expect(data.byteLength).toBe(size);
    }

    function assertEncodeThrows<T>(options: { serializer: st.Serializer<T>; value: any }) {
        const { serializer, value } = options;

        expect(() => st.write(serializer, value)).toThrow();
    }

    function assertMatchesSnapshot<T>(options: {
        serializer: st.Serializer<T>;
        value: NoInfer<T>;
    }) {
        const { serializer, value } = options;

        const data = st.write(serializer, value);
        const result = expect(data);
        if (!result.toMatchSnapshot) {
            throw new Error("Snapshot testing not supported on expect used");
        }
        result.toMatchSnapshot();
    }

    return {
        readWrite,
        assertEncodesAndDecodes,
        assertEncodesAs,
        assertEncodesAsSize,
        assertEncodeThrows,
        assertSerializerSize,
        assertMatchesSnapshot,
    };
}
