import { Command } from "commander";

const program = new Command();

program
	.name("calendar-cli")
	.description("Lint and generate ICS files")

program
	.command("lint")
	.argument("<file>", "Path to YAML data")
	.action((file: string) => {
		console.log(file);
	});

program
	.command("gen")
	.argument("<file>", "Path to YAML data")
	.action((file: string) => {
		console.log(file);
	});

program.parse(process.argv);
