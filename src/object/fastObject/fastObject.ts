import type { InferInput, InferOutput, Serializer } from "../../types.ts";

type InferObjectInput<T extends Record<string, Serializer<any>>> = {
    [Key in keyof T]: InferInput<T[Key]>;
};

type InferObjectOutput<T extends Record<string, Serializer<any>>> = {
    [Key in keyof T]: InferOutput<T[Key]>;
};

const definitionSymbol = Symbol();

/**
 * `fastObject` is equivelent to object but it uses eval to improve performance, additionally it omits error reporting
 *
 * This means that is should be avoided in scenarios where CSP is required
 *
 * ```ts
 * st.fastObject({
 *     name: st.string(st.u32()),
 *     age: st.u8(),
 *     createdAt: st.f64(),
 * })
 * ```
 *
 * > **Note:** Using `st.lazy` affects the performance of `st.fastObject` as it prevents discovery of child objects, avoid when performance is a requirement
 *
 * > **DANGER**: Do not use dynamic keys as it a potential RCE vector due to using `eval`, please use static sensical keys
 *
 * @group Object
 */
export function fastObject<T extends Record<string, Serializer<any>>>(
    definition: T,
): Serializer<InferObjectInput<T>, InferObjectOutput<T>> {
    let serializers: [string, Serializer<any>][] = [];
    let writeBody = "";
    let readBody = "";

    const isIdent = (key: string) => key.match(/[a-zA-Z_][a-zA-Z0-9_]+/);
    const asDefKey = (key: string) => {
        if (isIdent(key)) {
            return key;
        } else {
            key = key //
                .replace("\'", "\\\'")
                .replace('"', '\\"');
            return `["${key}"]`;
        }
    };

    function generateSerializers(serializer: Serializer<any>, keys: string[]) {
        if (definitionSymbol in serializer) {
            const definition = serializer[definitionSymbol] as any;
            const key = keys.at(-1)!;

            readBody += `${asDefKey(key)}: {`;

            for (const key of Object.keys(definition as any)) {
                generateSerializers(definition[key], [...keys, key]);
            }
            readBody += `},`;
        } else {
            let path = "";
            for (const key of keys) {
                path += isIdent(key) //
                    ? `.${key}`
                    : `[${JSON.stringify(key)}]`;
            }

            const id = `s${Object.keys(serializers).length}`;
            const key = asDefKey(keys.at(-1)!);

            serializers.push([id, serializer]);
            writeBody += `${id}(c, v${path});`;
            readBody += `${key}: ${id}(c),`;
        }
    }

    for (const key of Object.keys(definition)) {
        generateSerializers(definition[key], [key]);
    }

    const writeFactory = new Function(
        ...serializers.map((v) => v[0]),
        `return (c, v) => {${writeBody}}`,
    );
    const readFactory = new Function(
        ...serializers.map((v) => v[0]),
        `return (c, v) => ({${readBody}})`,
    );

    const write = writeFactory(...serializers.map((v) => v[1].write));
    const read = readFactory(...serializers.map((v) => v[1].read));

    let size = Object.values(definition).reduce((total, v) => total + (v.size as number), 0);

    return {
        //@ts-expect-error, this doesn't match the type
        [definitionSymbol]: definition,
        size: isNaN(size) ? undefined : size,
        write,
        read,
    };
}
