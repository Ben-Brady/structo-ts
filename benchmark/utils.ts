import { run, bench, compact, summary, group, boxplot } from "mitata";

export function benchmark<T>(options: {
    name: string;
    range: [number, number];
    generateData: (size: number) => T;
    handwritten: (value: T) => ArrayBuffer; //
    library: (value: T) => ArrayBuffer; //
}) {
    const { generateData, name, range, library, handwritten } = options;

    function verify(data: T) {
        const a = handwritten(data);
        const b = library(data);
        if (a.byteLength !== b.byteLength) throw new Error("Invalid Lengths");

        const aBytes = new Uint8Array(a);
        const bBytes = new Uint8Array(b);
        for (let i = 0; i < a.byteLength; i++) {
            if (aBytes[i] !== bBytes[i]) {
                throw new Error("Did not match");
            }
        }
    }

    verify(generateData(100));

    const [start, end] = range;
    const sizes = [];
    let size: number | undefined;
    do {
        size = size === undefined ? start : size * 10
        size = Math.min(size, end);
        sizes.push(size);
    } while (size < end);

    for (const size of sizes) {
        const DIVIDER = "---------------------------------------------------------------------------"
        summary(() => {

            group(`\n\n${name} x${size}`, () => {
                const data = generateData(size);
                bench(`handwritten`, () => handwritten(data)).compact(true);
                bench(`library`, () => library(data))
                    .compact(true)
                    .baseline(true);
            });
        });
    }
}
