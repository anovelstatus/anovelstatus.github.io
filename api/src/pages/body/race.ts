import { chapterFilter, parseDynamicTable } from "../shared";

export function getRaces(info: SpreadsheetInfo) {
	const definition: Table<Race> = {
		range: info.ss.getRange(info.ranges.Races),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: { type: "number" } },
			{ key: "name", source: { type: "exact", name: "Race" }, parse: { type: "string" } },
			{ key: "tier", source: { type: "exact", name: "Tier" }, parse: { type: "string" } },
			{ key: "talents", source: { type: "exact", name: "Talents" }, parse: { type: "split_tiered_id" } },
			{ key: "freeSlots", source: { type: "exact", name: "Free Slots" }, parse: { type: "number" } },
			{ key: "note", source: { type: "exact", name: "Description" }, parse: { type: "rich" } },
		],
		extra: undefined,
	};
	return parseDynamicTable(info, definition);
}
