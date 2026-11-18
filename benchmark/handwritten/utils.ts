import { run, bench, measure, summary, group, boxplot } from "mitata";

export function benchmark<T>(options: {
    name: string;
    sizes: number[];
    compact: boolean;
    generateData: (size: number) => T;
    handwritten: (value: T) => ArrayBuffer; //
    library: (value: T) => ArrayBuffer; //
}) {
    const { name, sizes, compact, generateData, library, handwritten } = options;

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

    for (const size of sizes) {
        const runBenchmark = () =>
            summary(() => {
                group(`${name} x${size}`, () => {
                    const data = generateData(size);
                    bench(`library`, () => library(data))
                        .baseline(true)
                        .compact(compact);
                    bench(`handwritten`, () => handwritten(data)).compact(compact);
                });
            });

        if (compact) {
            runBenchmark();
        } else {
            boxplot(() => runBenchmark());
        }
    }
}
