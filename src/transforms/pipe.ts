import type { Serializer } from "../types.js";

export type Transform<T = any, TNext = T> = (type: Serializer<TNext>) => Serializer<T>;

export function pipe<TStart, T1>(
    type: Serializer<TStart>,
    p1: Transform<T1, TStart>,
): Serializer<T1>;

export function pipe<TStart, T1, T2>(
    type: Serializer<TStart>,
    p1: Transform<T1, TStart>,
    p2: Transform<T2, T1>,
): Serializer<T2>;

export function pipe<TStart, T1, T2, T3>(
    type: Serializer<TStart>,
    p1: Transform<T1, TStart>,
    p2: Transform<T2, T1>,
    p3: Transform<T3, T2>,
): Serializer<T3>;

export function pipe<TStart, T1, T2, T3, T4>(
    type: Serializer<TStart>,
    p1: Transform<T1, TStart>,
    p2: Transform<T2, T1>,
    p3: Transform<T3, T2>,
    p4: Transform<T4, T3>,
): Serializer<T4>;

export function pipe<TStart, T1, T2, T3, T4, T5>(
    type: Serializer<TStart>,
    p1: Transform<T1, TStart>,
    p2: Transform<T2, T1>,
    p3: Transform<T3, T2>,
    p4: Transform<T4, T3>,
    p5: Transform<T5, T4>,
): Serializer<T5>;

export function pipe<TStart, T1, T2, T3, T4, T5, T6>(
    type: Serializer<TStart>,
    p1: Transform<T1, TStart>,
    p2: Transform<T2, T1>,
    p3: Transform<T3, T2>,
    p4: Transform<T4, T3>,
    p5: Transform<T5, T6>,
): Serializer<T6>;

export function pipe<TStart, T1, T2, T3, T4, T5, T6, T7>(
    type: Serializer<TStart>,
    p1: Transform<T1, TStart>,
    p2: Transform<T2, T1>,
    p3: Transform<T3, T2>,
    p4: Transform<T4, T3>,
    p5: Transform<T5, T6>,
    p6: Transform<T6, T7>,
): Serializer<T7>;

export function pipe<TStart, T1, T2, T3, T4, T5, T6, T7, T8>(
    type: Serializer<TStart>,
    p1: Transform<T1, TStart>,
    p2: Transform<T2, T1>,
    p3: Transform<T3, T2>,
    p4: Transform<T4, T3>,
    p5: Transform<T5, T6>,
    p6: Transform<T6, T7>,
    p7: Transform<T7, T8>,
): Serializer<T8>;

export function pipe<TStart, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    type: Serializer<TStart>,
    p1: Transform<T1, TStart>,
    p2: Transform<T2, T1>,
    p3: Transform<T3, T2>,
    p4: Transform<T4, T3>,
    p5: Transform<T5, T6>,
    p6: Transform<T6, T7>,
    p7: Transform<T7, T8>,
    p8: Transform<T8, T9>,
): Serializer<T9>;

/**
 * Pipe lets you chain modification functions together
 * ```
 * st.object({
 *   age: st.u32(),
 *   ageInMonths: st.pipe(
 *     st.u32(),
 *     st.modify(v => v * 12),
 *     st.offset("relative", -8),
 *   )})
 * ```
 */
export function pipe<T, TPipeline extends Transform[]>(
    type: Serializer<T>,
    ...pipeline: TPipeline[]
): any {
    //@ts-ignore
    return pipeline.reduce((v, func) => func(v), type);
}
