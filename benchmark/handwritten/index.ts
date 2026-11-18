import { run } from "mitata";
import * as entity from "./entity.ts";
import * as user from "./user.ts";

async function main() {
    await user.generateBenchmarks(true);
    await entity.generateBenchmarks(true);
    await run();
}

main();
