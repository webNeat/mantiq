import { Command } from "commander";

const program = new Command();

program
  .name("mantiq")
  .description("CLI for mantiq")
  .version("1.0.0");

program.parse();
