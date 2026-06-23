import { run } from "mitata";
import * as entity from "./entity.js";
import * as user from "./user.js";

async function main() {
    await user.generateBenchmarks();
    await entity.generateBenchmarks();
    await run();
}

main();
