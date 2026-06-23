# Benchmarks

The results are generated

The handwritten examples are optimised as much as possible


The bencharm
- Node: `npx tsx benchmark/index.ts`
- Deno: `deno run --allow-all --sloppy-imports benchmark/index.ts`
- Bun: `bun benchmark/index.ts`

## Node

```ts
clk: ~3.50 GHz
cpu: AMD Ryzen 5 3600 6-Core Processor
runtime: node 24.0.0 (x64-linux)

benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
•

Users x1
------------------------------------------- -------------------------------
handwritten                    2.89 µs/iter   3.07 µs   3.43 µs ▂▆█▁▅▄▄▄▂▂▂
library                        3.05 µs/iter   3.19 µs   3.74 µs ▇█▆▂▃▃▃▂▂▂▂

summary
  library
   1.06x slower than handwritten

•

Users x10
------------------------------------------- -------------------------------
handwritten                    9.15 µs/iter   9.85 µs  10.44 µs ▆▃▆▁▃▁▃█▆▁▆
library                       13.76 µs/iter  14.39 µs  14.77 µs █▅▁▁▁▁█▅▁▅▅

summary
  library
   1.5x slower than handwritten

•

Users x100
------------------------------------------- -------------------------------
handwritten                   79.29 µs/iter  86.49 µs  88.26 µs ▃▁▃▃▆▃▁▁▃█▃
library                       86.98 µs/iter  76.01 µs 394.77 µs █▃▁▁▁▁▁▁▁▁▁

summary
  library
   1.1x slower than handwritten

•

Users x1000
------------------------------------------- -------------------------------
handwritten                  668.13 µs/iter 638.68 µs   1.72 ms █▆▁▁▂▂▂▁▁▁▁
library                      724.27 µs/iter 694.48 µs   1.74 ms █▅▂▁▁▁▁▁▁▁▁

summary
  library
   1.08x slower than handwritten

•

Users x10000
------------------------------------------- -------------------------------
handwritten                    7.23 ms/iter   7.75 ms  13.10 ms ▄█▃▃▂▂▁▂▂▂▂
library                        8.32 ms/iter   9.42 ms  12.00 ms ▅▇█▅▅▅▄▃▃▂▁

summary
  library
   1.15x slower than handwritten

•

Users x100000
------------------------------------------- -------------------------------
handwritten                  103.10 ms/iter 108.68 ms 149.37 ms ▃▅▃▃▃█▁▁▁▁▃
library                       73.71 ms/iter  76.12 ms  78.48 ms ▅▅██▅▁▁▅▅▅▅

summary
  library
   1.4x faster than handwritten

•

Users x250000
------------------------------------------- -------------------------------
handwritten                  255.04 ms/iter 270.17 ms 422.00 ms █▆█▁▃▁▃▁▁▁▃
library                      176.31 ms/iter 183.34 ms 194.54 ms ▃▁▃▁▃█▁▅▃▁▃

summary
  library
   1.45x faster than handwritten

•

Entities x1
------------------------------------------- -------------------------------
handwritten                    2.55 µs/iter   2.66 µs   2.98 µs ▃█▄▄▄▄▄▃▁▂▁
library                        2.05 µs/iter   2.22 µs   2.79 µs ██▇▆▅▆▄▂▂▂▂

summary
  library
   1.24x faster than handwritten

•

Entities x10
------------------------------------------- -------------------------------
handwritten                    3.92 µs/iter   4.06 µs   4.94 µs ▂▄█▅▅▅▂▃▂▁▂
library                        3.77 µs/iter   4.03 µs   5.21 µs ▃▇█▅▆▃▃▃▂▂▂

summary
  library
   1.04x faster than handwritten

•

Entities x100
------------------------------------------- -------------------------------
handwritten                    9.21 µs/iter   9.48 µs  10.08 µs ▇▁▂▁▁▂█▂▂▁▂
library                       10.89 µs/iter  11.46 µs  12.53 µs ▃█▃▃▃▁▆▃▁▁▃

summary
  library
   1.18x slower than handwritten

•

Entities x1000
------------------------------------------- -------------------------------
handwritten                   60.85 µs/iter  63.39 µs  66.76 µs ▃▃▁▃█▃▁▆▃▁▃
library                       93.54 µs/iter  97.86 µs 153.50 µs ▄█▂▂▂▂▁▁▁▁▁

summary
  library
   1.54x slower than handwritten

•

Entities x10000
------------------------------------------- -------------------------------
handwritten                  564.46 µs/iter 628.02 µs   1.05 ms ▇█▃▃▂▃▂▁▁▁▁
library                      934.12 µs/iter 904.25 µs   1.47 ms █▇▂▁▁▁▁▁▂▁▁

summary
  library
   1.65x slower than handwritten

•

Entities x100000
------------------------------------------- -------------------------------
handwritten                    6.24 ms/iter   7.03 ms   8.53 ms ▄█▅▂▂▁▂▁▂▂▂
library                        9.91 ms/iter   9.98 ms  13.48 ms ▄█▃▁▂▁▁▁▁▁▁

summary
  library
   1.59x slower than handwritten

•

Entities x250000
------------------------------------------- -------------------------------
handwritten                   13.87 ms/iter  14.56 ms  18.19 ms ▇█▃▂▅▂▂▂▂▃▂
library                       23.99 ms/iter  25.23 ms  29.25 ms ▆█▂▂▂▃▁▂▁▂▂

summary
  library
   1.73x slower than handwritten
```

## Deno

```ts
clk: ~2.88 GHz
cpu: AMD Ryzen 5 3600 6-Core Processor
runtime: deno 2.8.2 (x86_64-unknown-linux-gnu)

benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
•

Users x1
------------------------------------------- -------------------------------
handwritten                    1.29 µs/iter   1.45 µs   1.70 µs ▃▃▄▅▃▃▇█▅▃▁
library                        1.70 µs/iter   1.59 µs   4.27 µs █▃▁▁▁▂▁▁▁▁▁

summary
  library
   1.31x slower than handwritten

•

Users x10
------------------------------------------- -------------------------------
handwritten                    9.49 µs/iter  11.13 µs  11.56 µs ▆▃▃▃▃▁▃▃▃▃█
library                       18.48 µs/iter  23.22 µs  28.77 µs █▅█▁▅▁█▅▁▅▅

summary
  library
   1.95x slower than handwritten

•

Users x100
------------------------------------------- -------------------------------
handwritten                   87.37 µs/iter  85.76 µs 333.00 µs █▅▂▁▂▁▁▁▁▁▁
library                       91.93 µs/iter  85.46 µs 377.05 µs █▄▂▁▁▁▁▁▁▁▁

summary
  library
   1.05x slower than handwritten

•

Users x1000
------------------------------------------- -------------------------------
handwritten                  894.60 µs/iter 906.40 µs   2.68 ms █▆▂▂▁▂▂▁▁▁▁
library                      865.72 µs/iter 808.93 µs   2.92 ms █▃▂▁▁▁▁▁▁▁▁

summary
  library
   1.03x faster than handwritten

•

Users x10000
------------------------------------------- -------------------------------
handwritten                    9.33 ms/iter  10.54 ms  18.79 ms ██▄▃▂▂▂▂▃▁▁
library                        9.50 ms/iter   8.72 ms  29.07 ms █▃▂▁▁▁▁▁▁▁▁

summary
  library
   1.02x slower than handwritten

•

Users x100000
------------------------------------------- -------------------------------
handwritten                   97.96 ms/iter 106.25 ms 118.70 ms ▆▃▃█▁▁▁▆▁▃▃
library                      129.15 ms/iter 129.70 ms 137.10 ms █▁▅▁▁█▁▅██▅

summary
  library
   1.32x slower than handwritten

•

Users x250000
------------------------------------------- -------------------------------
handwritten                  277.46 ms/iter 302.88 ms 427.80 ms █▃▃▆▃▃▃▁▁▁▃
library                      312.20 ms/iter 306.11 ms 328.57 ms ▃▃▁█▆▃▁▃▁▁▆

summary
  library
   1.13x slower than handwritten

•

Entities x1
------------------------------------------- -------------------------------
handwritten                  779.56 ns/iter 797.88 ns   2.02 µs ▂█▆▃▁▁▁▁▁▁▁
library                        1.01 µs/iter   1.17 µs   2.41 µs ▄█▇▅▄▃▂▁▁▁▁

summary
  library
   1.3x slower than handwritten

•

Entities x10
------------------------------------------- -------------------------------
handwritten                    2.17 µs/iter   2.73 µs   3.97 µs ▅▂▂▄▃▄█▅▂▁▁
library                        3.21 µs/iter   4.30 µs   4.93 µs ▆▄▃▄▃▂▄▅█▅▅

summary
  library
   1.48x slower than handwritten

•

Entities x100
------------------------------------------- -------------------------------
handwritten                    8.61 µs/iter  11.77 µs  13.66 µs █▁▂▅▁▂▁▂▂▂▄
library                       10.33 µs/iter  12.03 µs  13.76 µs █▁▆▃▆▁▁▃▁▁▆

summary
  library
   1.2x slower than handwritten

•

Entities x1000
------------------------------------------- -------------------------------
handwritten                   48.99 µs/iter  50.84 µs  57.86 µs ▃▆█▁▁▃▆▁▃▁▃
library                       79.29 µs/iter  82.86 µs 142.98 µs █▃▂▂▂▁▂▁▁▁▁

summary
  library
   1.62x slower than handwritten

•

Entities x10000
------------------------------------------- -------------------------------
handwritten                  436.49 µs/iter 440.95 µs 719.44 µs ▆█▃▂▂▁▁▂▁▁▁
library                      737.04 µs/iter 721.25 µs   1.24 ms ▇█▂▁▁▁▁▁▁▁▁

summary
  library
   1.69x slower than handwritten

•

Entities x100000
------------------------------------------- -------------------------------
handwritten                    6.71 ms/iter   7.35 ms  10.38 ms ▂▅▃█▇▄▂▂▃▂▁
library                       10.86 ms/iter  12.80 ms  15.38 ms ▅▇▅▂▃▂▆█▂▃▂

summary
  library
   1.62x slower than handwritten

•

Entities x250000
------------------------------------------- -------------------------------
handwritten                   17.36 ms/iter  22.37 ms  23.48 ms ▇▅▂▂▂▂▂▁▃█▃
library                       18.71 ms/iter  19.06 ms  20.87 ms ▅█▃▅▄▃▂▃▁▁▂

summary
  library
   1.08x slower than handwritten
```

## Bun

```ts
clk: ~3.09 GHz
cpu: AMD Ryzen 5 3600 6-Core Processor
runtime: bun 1.3.9 (x64-linux)

benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
•

Users x1
------------------------------------------- -------------------------------
handwritten                    1.19 µs/iter   1.24 µs   7.09 µs █▅▂▁▁▁▁▁▁▁▁
library                        1.44 µs/iter   1.83 µs   3.88 µs █▃▁▂▂▂▁▁▁▁▁

summary
  library
   1.21x slower than handwritten

•

Users x10
------------------------------------------- -------------------------------
handwritten                    2.78 µs/iter   2.99 µs   5.32 µs █▃▂▃▂▁▁▁▁▁▁
library                        3.73 µs/iter   4.23 µs   6.13 µs █▅▁▂▄▁▂▂▁▁▁

summary
  library
   1.34x slower than handwritten

•

Users x100
------------------------------------------- -------------------------------
handwritten                   22.18 µs/iter  23.70 µs  27.23 µs ▆█▆▃▁▁▃▁▁▃▃
library                       28.93 µs/iter  29.70 µs  32.58 µs █▃▁▃▆▆▁▃▁▁▃

summary
  library
   1.3x slower than handwritten

•

Users x1000
------------------------------------------- -------------------------------
handwritten                  247.98 µs/iter 271.75 µs 414.98 µs ▄█▇▄▄▃▂▁▁▁▁
library                      324.37 µs/iter 348.59 µs 930.15 µs █▆▄▂▁▁▁▁▁▁▁

summary
  library
   1.31x slower than handwritten

•

Users x10000
------------------------------------------- -------------------------------
handwritten                    2.60 ms/iter   2.93 ms   4.53 ms ██▃▃▄▂▂▂▁▁▁
library                        2.75 ms/iter   2.73 ms   4.50 ms █▆▃▁▂▁▁▁▁▁▁

summary
  library
   1.06x slower than handwritten

•

Users x100000
------------------------------------------- -------------------------------
handwritten                   23.17 ms/iter  24.66 ms  27.64 ms █▂▂▃▁▂▃▁▂▂▂
library                       29.20 ms/iter  28.95 ms  36.05 ms ▇█▆▃▁▂▁▁▁▁▂

summary
  library
   1.26x slower than handwritten

•

Users x250000
------------------------------------------- -------------------------------
handwritten                   60.86 ms/iter  57.22 ms  83.60 ms █▇▁▁▁▁▂▁▁▁▂
library                       81.85 ms/iter  81.82 ms  86.64 ms █▆▃▁▃▃▁▃▁▃▃

summary
  library
   1.35x slower than handwritten

•

Entities x1
------------------------------------------- -------------------------------
handwritten                  388.61 ns/iter 278.14 ns   1.48 µs █▁▂▁▁▁▁▁▁▁▁
library                      463.16 ns/iter 385.40 ns   4.59 µs █▁▁▁▁▁▁▁▁▁▁

summary
  library
   1.19x slower than handwritten

•

Entities x10
------------------------------------------- -------------------------------
handwritten                  639.79 ns/iter 517.45 ns   3.94 µs █▂▁▁▁▁▁▁▁▁▁
library                      945.53 ns/iter 837.95 ns   3.93 µs █▂▁▁▁▁▁▁▁▁▁

summary
  library
   1.48x slower than handwritten

•

Entities x100
------------------------------------------- -------------------------------
handwritten                    3.54 µs/iter   3.84 µs   6.02 µs █▄▁▂▂▁▁▁▂▁▂
library                        5.07 µs/iter   5.32 µs   6.14 µs █▄▂▂▃▄▁▂▂▁▂

summary
  library
   1.43x slower than handwritten

•

Entities x1000
------------------------------------------- -------------------------------
handwritten                   69.09 µs/iter  75.46 µs 149.53 µs █▁▄▂▁▁▁▁▁▁▁
library                       84.79 µs/iter  77.34 µs 213.66 µs █▂▁▁▁▁▁▁▁▁▁

summary
  library
   1.23x slower than handwritten

•

Entities x10000
------------------------------------------- -------------------------------
handwritten                  746.95 µs/iter 834.81 µs   1.24 ms ▆█▅▅▅▃▃▂▁▁▁
library                      942.31 µs/iter 999.85 µs   1.56 ms ▄██▅▃▂▂▂▁▁▁

summary
  library
   1.26x slower than handwritten

•

Entities x100000
------------------------------------------- -------------------------------
handwritten                    7.32 ms/iter   7.64 ms  10.66 ms ▃█▃▁▂▂▂▁▁▂▁
library                        9.59 ms/iter   9.70 ms  13.00 ms ▃█▇▄▂▁▂▂▁▁▁

summary
  library
   1.31x slower than handwritten

•

Entities x250000
------------------------------------------- -------------------------------
handwritten                   18.02 ms/iter  18.85 ms  21.24 ms ▄█▆▁▃▄▁▁▃▂▄
library                       23.96 ms/iter  24.43 ms  28.95 ms ▃██▃▆▂▁▂▁▁▃

summary
  library
   1.33x slower than handwritten
```
