import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import YAML from "yaml";
import {
	Ajv,
	type ErrorObject,
	type ValidateFunction,
} from "ajv";
import addFormats from "ajv-formats";

export type EventsDoc = unknown;

function format_ajv_errors(errors: ErrorObject[] | null | undefined): string {
	if (!errors?.length) {
		return "Unknown schema error";
	}

	return errors.map(e => {
		const where = e.instancePath ? `at ${e.instancePath}` : `at <root>`;
		const msg = e.message ?? "invalid";
		const extra =
			e.keyword === "additionalProperties" && (e.params as any)?.additionalProperty
				? ` (unexpected: ${(e.params as any).additionalProperty})`
				: "";
		return `- ${where}: ${msg}${extra}`;
	}).join("\n");
}

export async function load_yaml_file(filePath: string): Promise<unknown> {
	const text = await fs.readFile(filePath, "utf8");
	const doc = YAML.parseDocument(text, {
		strict: true,
	});

	if (doc.errors.length) {
		const msg = doc.errors.map((e) => e.message).join("\n");
		throw new Error(`YAML parse error in ${filePath}:\n${msg}`);
	}

	return doc.toJSON();
}

let cachedValidate: ValidateFunction | null = null;

async function get_validator(): Promise<ValidateFunction> {
	if (cachedValidate)
		return cachedValidate;

	const ajv = new Ajv({
		allErrors: true,
		strict: true,
		allowUnionTypes: true,
	});

	addFormats.default(ajv);

	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const schema_path = path.resolve(__dirname, "..", "events.schema.json");
	const schema = JSON.parse(await fs.readFile(schema_path, "utf8"));
	const validate = ajv.compile(schema);
	cachedValidate = validate;
	return validate;
}

export async function load_and_validate_events(filePath: string): Promise<EventsDoc> {
	const value = await load_yaml_file(filePath);

	const validate = await get_validator();
	const ok = validate(value);
	if (!ok) {
		throw new Error(`Schema validation failed for ${filePath}:\n${format_ajv_errors(validate.errors)}`);
	}
	return value;
}
