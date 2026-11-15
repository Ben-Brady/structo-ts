import { run } from "mitata";
import * as entity from "./entity.ts";
import * as user from "./user.ts";

async function main() {
    await user.generateBenchmarks();
    await entity.generateBenchmarks();
    await run();
}

main();
