export type Pipeline<T, TNext> = (type: st.Serializer<TNext>) => st.Serializer<T>;

export function pipe<T>(
    type: st.Serializer<T>,
    ...pipeline: Pipeline<any, any>[]
): st.Serializer<T> {
    return pipeline.reduce((v, func) => func(v), type);
}
