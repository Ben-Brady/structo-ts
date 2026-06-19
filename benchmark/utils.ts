type Run<T> = {
    name: string;
    times: number;
    data: () => T;
};
export function benchmark<T>(options: {
    runs: Run<T>[];
    optimal: (value: T) => ArrayBuffer; //
    library: (value: T) => ArrayBuffer; //
}) {
    const { runs, library, optimal } = options;

    function verify() {
        const data = runs[0].data();
        const a = optimal(data);
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

    function measure(callback: () => void): number {
        const start = performance.now();
        callback();
        return performance.now() - start;
    }

    function bench(times: number, callback: () => void) {
        let numbers: number[] = [];
        for (let i = 0; i < times; i++) {
            numbers.push(measure(callback));
        }
        return numbers.reduce((a, b) => a + b, 0) / times;
    }

    verify();

    for (const { name, data: generateData, times } of runs) {
        const data = generateData();

        const formatTime = (ms: number) => {
            if (ms > 0.01) {
                return `${ms.toFixed(2)}ms`;
            } else {
                return `${(ms * 1000).toFixed(2)}μs`;
            }
        };

        const duration = measure(() => {
            console.log(`${name}:`);
            const optimalMs = bench(times, () => optimal(data));
            console.log(`    Optimal: ${formatTime(optimalMs)}`);
            const libraryMs = bench(times, () => library(data));
            console.log(`    Library: ${formatTime(libraryMs)}`);
            console.log(`    ${((optimalMs / libraryMs) * 100).toFixed(2)}% as Fast`);
        });
        console.log(`    Test Took ${(duration / 1000).toFixed()}s`);
    }
}
