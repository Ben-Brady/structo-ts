import { st } from "../../index.ts";

type InferObject<T extends Record<string, st.Serializer<any>>> = {
    [Key in keyof T]: st.Infer<T[Key]>;
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
 * > **DANGER**: Do not use dynamic keys as it a potential RCE vector due to using `eval`, please use static keys
 *
 * @group Object
 */
export function fastObject<T extends Record<string, st.Serializer<any>>>(
    definition: T,
): st.Serializer<InferObject<T>> {
    let ids: string[] = [];
    let serializers: st.Serializer<any>[] = [];

    let estimateLines: string[] = [];
    let writeBody = "";
    let readBody = "";
    let totalExpectedSize = 0;

    const isIdent = (key: string) => key.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/);
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
    function generateSerializers(serializer: st.Serializer<any>, keys: string[]) {
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

            ids.push(id);
            serializers.push(serializer);

            writeBody += `${id}.write(c, v${path});`;
            readBody += `${key}: ${id}.read(c),`;

            totalExpectedSize += serializer.size ?? 0;
            if (!serializer.size && serializer.estimateSize) {
                estimateLines.push(`total += ${id}.estimateSize(v${path})`);
            }
        }
    }

    for (const key of Object.keys(definition)) {
        generateSerializers(definition[key], [key]);
    }
    let estimateFunction: string;
    if (estimateLines.length === 0) {
        estimateFunction = `() => ${totalExpectedSize}`;
    } else {
        estimateFunction = `(v) => {\nlet total = ${totalExpectedSize};\n${estimateLines.join(";\n")};\n return total;\n}`;
    }

    const readFactory = new Function(...ids, `return (c)=>({${readBody}})`);
    const read = readFactory(...serializers);

    const writeFactory = new Function(...ids, `return (c,v)=>{${writeBody}}`);
    const write = writeFactory(...serializers);

    const estimateFactory = new Function(...ids, `return ${estimateFunction}`);
    const estimateSize = estimateFactory(...serializers);

    const size = Object.values(definition).reduce((total, v) => total + (v.size as number), 0);

    return {
        //@ts-expect-error, this doesn't match the type
        [definitionSymbol]: definition,
        size: isNaN(size) ? undefined : size,
        estimateSize,
        write,
        read,
    };
}
