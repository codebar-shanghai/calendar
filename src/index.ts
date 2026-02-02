import { Command } from "commander";
import { lint_command } from "./lint.js";
import { generate_calendars } from "./gen.js";

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
			console.error(err);
			process.exitCode = 1;
		}
	});

type GenCliOpts = {
	outDir: string;
	limit: number;
};

program
	.command("gen")
	.argument("<file>", "Path to YAML data")
	.option("-d, --out-dir <dir>", "output directory", "public")
	.option("--limit <n>", "keep latest N per kind", (v) => Number(v), 10)
	.action(async (file, opts) => {
		try {
			const o = opts as GenCliOpts;
			const events = await lint_command(file);
			await generate_calendars(events, {
				outDir: o.outDir,
				limitiedPerKind: o.limit,
			});
			console.log(`Wrote ICS files(s) to ${opts.outDir}`);
		} catch (err) {
			console.error(err);
			process.exitCode = 1;
		}
	});

program.parse(process.argv);
