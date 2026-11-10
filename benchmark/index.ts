import { run } from "mitata";
import * as entity from "./entity";
import * as user from "./user";

async function main() {
    await user.generateBenchmarks();
    await entity.generateBenchmarks();
    await run();
}

main();
