import type { InferInput, Serializer } from "../../types";

type InferObject<T> =
    T extends Record<string, Serializer<any>> ? { [Key in keyof T]: InferInput<T[Key]> } : never;

const definitionSymbol = Symbol();

export function fastObject<T extends Record<string, Serializer<any>>>(
    definition: T,
): Serializer<InferObject<T>> {
    let serializers: [string, Serializer<any>][] = [];

    let writeBody = "";
    let readBody = "";

    function generateSerializers(serializer: Serializer<any>, keys: string[]) {
        if (definitionSymbol in serializer) {
            const definition = serializer[definitionSymbol] as any;
            readBody += `${keys[keys.length - 1]}: {`;
            for (const key of Object.keys(definition as any)) {
                generateSerializers(definition[key], [...keys, key]);
            }
            readBody += `},`;
        } else {
            let path = "";
            for (const key of keys) {
                if (key.match(/[a-zA-Z_][a-zA-Z0-9_]*/)) {
                    path += `.${key}`;
                } else {
                    path += `[${JSON.stringify(key)}]`;
                }
            }

            let name = `s${Object.keys(serializers).length}`;
            serializers.push([name, serializer]);
            writeBody += `${name}(c, v${path});`;
            readBody += `${keys[keys.length - 1]}: ${name}(c),`;
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
        //@ts-ignore
        [definitionSymbol]: definition,
        size: isNaN(size) ? undefined : size,
        write,
        read,
    };
}
