export function throwSerializationError(err: any, path: (string | number)[]): never {
    let pathStr = path.map((v) => `[${v}]`).join("");
    throw new Error(
        `Failed at value${pathStr}: \n${err}`, //
        { cause: err },
    );
}
