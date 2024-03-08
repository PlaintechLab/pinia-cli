#!/usr/bin/env node

import { Command, Option } from "commander";
import * as figlet from "figlet";
import { createStore } from "./utils";

const program = new Command();

console.log(figlet.textSync("Pinia CLI"));

program
    .version("1.0.0")
    .description("An example CLI for Pinia to generate stores")
    .command("generate-store")
    .alias("g")
    .description("Generate a Pinia store")
    .requiredOption("-n, --name <name>", "Name of the store")
    .option("-d, --directory <directory>", "Directory to create the store")
    .addOption(
        new Option("-t, --type <type>", "Type of store")
            .choices(["option", "setup"])
            .default("option")
    )
    .action((cmd) => {
        const options = cmd.name
            ? { name: cmd.name, directory: cmd.directory, type: cmd.type }
            : {};
        console.log(`Generating store with name ${options.name}...`);
        createStore(options.name, options.directory, options.type);
    })
    .parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
