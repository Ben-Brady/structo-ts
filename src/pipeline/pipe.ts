import type { Serializer } from "../types.ts";

/**
 * The type used to define a pipeline
 *
 *
 * @group Pipeline
 */
export type Pipeline<T = any, TNext = T> = (type: Serializer<TNext>) => Serializer<T>;

export function pipe<TStart, T1>(
    type: Serializer<TStart>,
    p1: Pipeline<T1, TStart>,
): Serializer<T1>;

export function pipe<TStart, T1, T2>(
    type: Serializer<TStart>,
    p1: Pipeline<T1, TStart>,
    p2: Pipeline<T2, T1>,
): Serializer<T2>;

export function pipe<TStart, T1, T2, T3>(
    type: Serializer<TStart>,
    p1: Pipeline<T1, TStart>,
    p2: Pipeline<T2, T1>,
    p3: Pipeline<T3, T2>,
): Serializer<T3>;

export function pipe<TStart, T1, T2, T3, T4>(
    type: Serializer<TStart>,
    p1: Pipeline<T1, TStart>,
    p2: Pipeline<T2, T1>,
    p3: Pipeline<T3, T2>,
    p4: Pipeline<T4, T3>,
): Serializer<T4>;

export function pipe<TStart, T1, T2, T3, T4, T5>(
    type: Serializer<TStart>,
    p1: Pipeline<T1, TStart>,
    p2: Pipeline<T2, T1>,
    p3: Pipeline<T3, T2>,
    p4: Pipeline<T4, T3>,
    p5: Pipeline<T5, T4>,
): Serializer<T5>;

export function pipe<TStart, T1, T2, T3, T4, T5, T6>(
    type: Serializer<TStart>,
    p1: Pipeline<T1, TStart>,
    p2: Pipeline<T2, T1>,
    p3: Pipeline<T3, T2>,
    p4: Pipeline<T4, T3>,
    p5: Pipeline<T5, T4>,
    p6: Pipeline<T6, T5>,
): Serializer<T6>;

export function pipe<TStart, T1, T2, T3, T4, T5, T6, T7>(
    type: Serializer<TStart>,
    p1: Pipeline<T1, TStart>,
    p2: Pipeline<T2, T1>,
    p3: Pipeline<T3, T2>,
    p4: Pipeline<T4, T3>,
    p5: Pipeline<T5, T4>,
    p6: Pipeline<T6, T5>,
    p7: Pipeline<T7, T6>,
): Serializer<T7>;

export function pipe<TStart, T1, T2, T3, T4, T5, T6, T7, T8>(
    type: Serializer<TStart>,
    p1: Pipeline<T1, TStart>,
    p2: Pipeline<T2, T1>,
    p3: Pipeline<T3, T2>,
    p4: Pipeline<T4, T3>,
    p5: Pipeline<T5, T4>,
    p6: Pipeline<T6, T5>,
    p7: Pipeline<T7, T6>,
    p8: Pipeline<T8, T7>,
): Serializer<T8>;

export function pipe<TStart, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    type: Serializer<TStart>,
    p1: Pipeline<T1, TStart>,
    p2: Pipeline<T2, T1>,
    p3: Pipeline<T3, T2>,
    p4: Pipeline<T4, T3>,
    p5: Pipeline<T5, T4>,
    p6: Pipeline<T6, T5>,
    p7: Pipeline<T7, T6>,
    p8: Pipeline<T8, T7>,
    p9: Pipeline<T9, T8>,
): Serializer<T9>;

/**
 * `st.pipe` is the designed entrypoint for pipeline functions, it lets you write a pipeline from exit
 *
 * ---
 * ```
 * st.object({
 *   age: st.u32(),
 *   ageInMonths: st.pipe(
 *     st.u32(),
 *     st.modify(v => v * 12),
 *     st.offset("relative", -8),
 *   )})
 * ```
 *
 * @group Pipeline
 */
export function pipe<T, TPipeline extends Pipeline[]>(
    type: Serializer<T>,
    ...pipeline: TPipeline[]
): any {
    //@ts-expect-error, We can't type this
    return pipeline.reduce((v, func) => func(v), type);
}
