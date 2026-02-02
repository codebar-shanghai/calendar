import { load_and_validate_events } from "./data.js";

export async function lint_command(filePath: string) {
	const events = await load_and_validate_events(filePath);
	console.log(`OK: ${filePath}`);
	return events;
}
