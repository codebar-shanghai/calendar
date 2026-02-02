import { Command } from "commander";
import { lint_command } from "./lint.js";

const program = new Command();

program
	.name("calendar-cli")
	.description("Lint and generate ICS files")

program
	.command("lint")
	.argument("<file>", "Path to YAML data")
	.action(async (file: string) => {
		try {
			await lint_command(file);
		} catch (err) {
			console.log(err);
		}
	});

program
	.command("gen")
	.argument("<file>", "Path to YAML data")
	.action((file: string) => {
		console.log(file);
	});

program.parse(process.argv);
