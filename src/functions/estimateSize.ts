import type { Serializer } from "../types.ts";

/**
 * Helper to simply getting the size of a type
 *
 * - checks `serializer.size`
 * - checks `serializer.estimateSize(value)`
 * - otherwise 0
 */
export function estimateSize<T>(serializer: Serializer<T>, value: T): number {
    if (serializer.size !== undefined) return serializer.size;
    if (serializer.estimateSize) return serializer.estimateSize(value);
    return 0;
}
