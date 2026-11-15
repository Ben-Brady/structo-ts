/**
 * @group Types
 */
export type Serializer<T> = {
    /**
     * When this is set, the type has a statically known size
     *
     * This can be used to preallocate
     */
    size?: number | undefined;

    // TODO: add sizeHint support

    write: (ctx: WriterContext, value: T) => void;
    read: (ctx: ReaderContext) => T;
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
 * @deprecated
 * @group Types
 */
export type InferInput<T extends Serializer<any>> = Infer<T>;

/**
 * @deprecated
 * @group Types
 */
export type InferOutput<T extends Serializer<any>> = Infer<T>;

/**
 * Allows to infer the type of a serializer
 *
 * ---
 *
 * ```ts
 * const User = st.object({
 *     username: st.string(st.u32()),
 *     createdAt: st.u64BigInt(),
 * })
 *
 * type User = st.Infer<typeof User>
 * // expands to
 * type User = {
 *     username: string,
 *     age: bigint,
 * }
 * ```
 * @hidden
 */
export type Infer<T extends Serializer<any>> = T extends Serializer<infer V> ? V : never;
