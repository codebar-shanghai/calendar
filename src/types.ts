export type EventKind = "workshop" | "meetup" | "test";

export interface EventRecord {
	id: string,
	title: string;
	kind: EventKind;
	// ISO 8601 string strongly recommended, ideally with timezone offset.
	// e.g. "2026-03-10T19:00:00-07:00"
	start: string;
	end: string;

	description?: string;
	location?: string;  // human-friendly address is usually enough
	maps_url?: string;       // event page
}
