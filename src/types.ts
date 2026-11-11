/**
 * @group Types
 */
export type Serializer<TIn, TOut = TIn> = {
    size?: number | undefined;
    write: (ctx: WriterContext, value: TIn) => void;
    read: (ctx: ReaderContext) => TOut;
};

/**
 * @group Types
 */
export interface WriterContext<
    TBuffer extends ArrayBuffer | SharedArrayBuffer = ArrayBuffer | SharedArrayBuffer,
> {
    offset: number;
    buffer: TBuffer;
    view: DataView;
    bytes: Uint8Array;

    /**
     * Pushes the current index/key to the context for error reporting, supports both number and string indexes
     *
     * Using this API is optional, but provides a better experience when errors occur
     *
     * ---
     *
     * ```ts
     * ctx.pushPath(index)
     * type.write(ctx, value[i]);
     * ctx.popPath()
     * ```
     */
    pushPath(key: string | number): void;

    /**
     * Pops the current key for error reporting, see `pushPath` for details
     *
     * ---
     *
     * ```ts
     * ctx.pushPath(index)
     * type.write(ctx, value[i]);
     * ctx.popPath()
     * ```
     */
    popPath(): void;

    /**
     * Ensure that there are `n` number of bytes ahead of the current offset
     *
     * It won't allocate more data if there is that number of bytes already available,
     * this means that you can optimistically reserve
     */
    reserve: (length: number) => void;
}

/**
 * @group Types
 */
export interface ReaderContext<
    TBuffer extends ArrayBuffer | SharedArrayBuffer = ArrayBuffer | SharedArrayBuffer,
> {
    offset: number;
    buffer: TBuffer;
    view: DataView;
    bytes: Uint8Array;

    /**
     * Pushes the current index/key to the context for error reporting, supports both number and string indexes
     *
     * Using this API is optional, but provides a better experience when errors occur
     *
     * ---
     *
     * ```ts
     * ctx.pushPath(index)
     * type.write(ctx, value[i]);
     * ctx.popPath()
     * ```
     */
    pushPath(key: string | number): void;
    /**
     * Pops the current key for error reporting, see `pushPath` for details
     *
     * ---
     *
     * ```ts
     * ctx.pushPath(index)
     * type.write(ctx, value[i]);
     * ctx.popPath()
     * ```
     */
    popPath(): void;
}

/**
 * Allows to infer the Input into a serializer, this is the type needed to write it
 *
 * ---
 *
 * ```ts
 * const User = st.object({
 *     username: st.string(st.u32()),
 *     createdAt: st.u64BigInt(),
 * })
 *
 * type User = st.InferOutput<typeof User>
 * // expands to
 * type User = {
 *     username: string,
 *     // u64BigInt supports writing either `number | bigint`
 *     age: number | bigint,
 * }
 * ```
 *
 * @group Types
 */
export type InferInput<T extends Serializer<any>> = T extends Serializer<infer V, any> ? V : never;

/**
 * Allows to infer the Output from a serializer, this is the type returned when you read that type
 *
 * ---
 *
 * ```ts
 * const User = st.object({
 *     username: st.string(st.u32()),
 *     createdAt: st.u64BigInt(),
 * })
 *
 * type User = st.InferOutput<typeof User>
 * // expands to
 * type User = {
 *     username: string,
 *     age: bigint,
 * }
 * ```
 *
 * @group Types
 */
export type InferOutput<T extends Serializer<any>> = T extends Serializer<any, infer V> ? V : never;

/**
 * @deprecated use `st.InferOutput` instead
 * @hidden
 */
export type Infer<T extends Serializer<any>> = InferOutput<T>;
