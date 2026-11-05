export function assertInRange<T extends number | bigint>(value: T, start: T, end: T) {
    if (value < start || value >= end) throw new Error("Out of Range");
}

export function assertInteger(value: number | bigint) {
    if (!Number.isInteger(value)) throw new Error(`${value} is not an integer`);
}
