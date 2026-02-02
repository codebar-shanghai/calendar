import {
	mkdir,
	writeFile,
} from "node:fs/promises";
import { join } from "node:path";
import type { EventRecord, EventKind } from "./types.js";
import { make_calendar, to_ics_event } from "./data.js";

function start_ms(e: EventRecord): number {
	const t = new Date(e.start).getTime();
	if (Number.isNaN(t)) {
		throw new Error(`Invalid start datetime: ${e.start}`);
	}
	return t;
}

export interface GenOptions {
	outDir: string;
	limitedPerKind: number;
}

export async function generate_calendars(events: EventRecord[], opts: GenOptions): Promise<void> {
	await mkdir(opts.outDir, { recursive: true });

	const files: Record<EventKind, {
		name: string;
		calName: string;
		productId: string;
		events: EventRecord[];
	}> = {
		workshop: {
			name: "workshops.ics",
			calName: "Workshops from Codebar Shanghai",
			productId: "-//codebar-shanghai//workshop-feed",
			events: [],
		},
		meetup: {
			name: "meetups.ics",
			calName: "Meetups from Codebar Shanghai",
			productId: "-//codebar-shanghai//meetup-feed",
			events: [],
		},
		test: {
			name: "test.ics",
			calName: "Internal Test",
			productId: "-//codebar-shanghai//test",
			events: [],
		},
	};

	for (const e of events) {
		files[e.kind].events.push(e);
	}

	for (const k of Object.keys(files) as EventKind[]) {
		const { name, calName, productId, events } = files[k];
		if (events.length === 0) {
			continue;
		}

		events.sort((a, b) => start_ms(b) - start_ms(a));
		const icsEvents = events
			.slice(0, opts.limitedPerKind)
			.map(to_ics_event);
		const icsText = make_calendar(icsEvents, calName, productId);
		await writeFile(join(opts.outDir, name), icsText, "utf8");
	}
}
