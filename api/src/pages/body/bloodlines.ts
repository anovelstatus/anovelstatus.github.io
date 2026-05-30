import { chapterFilter, hasEntriesFilter, parseDynamicTable } from "../shared";

export function getBloodlines(info: SpreadsheetInfo) {
	const updates = getBloodlineUpdates(info);

	const definition: Table<Bloodline, BloodlineStatus[]> = {
		range: info.ss.getRange(info.ranges.Bloodlines),
		filter: hasEntriesFilter("updates"),
		fields: [
			{ key: "name", source: { type: "exact", name: "Bloodline" }, parse: { type: "string" } },
			{ key: "lore", source: { type: "exact", name: "Lore Key" }, parse: { type: "string" } },
			{ key: "quality", source: { type: "exact", name: "Quality" }, parse: { type: "string" } },
			{
				key: "updates",
				parse: {
					type: "custom",
					parse: ({ rowSoFar, extra }) => {
						return extra.filter((x) => x.name === rowSoFar.name);
					},
				},
			},
		],
		extra: updates,
	};
	return parseDynamicTable(info, definition);
}

export function getBloodlineUpdates(info: SpreadsheetInfo) {
	const definition: Table<BloodlineStatus> = {
		range: info.ss.getRange(info.ranges["Bloodline Updates"]),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "name", source: { type: "exact", name: "Race" }, parse: { type: "string" } },
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: { type: "number" } },
			{ key: "purity", source: { type: "exact", name: "Purity" }, parse: { type: "string_number" } },
			{ key: "status", source: { type: "exact", name: "Status" }, parse: { type: "string" } },
			{ key: "note", source: { type: "exact", name: "Cause" }, parse: { type: "rich" } },
			{ key: "title", source: { type: "exact", name: "Title" }, parse: { type: "tiered_id", optional: true } },
		],
		extra: undefined,
	};
	return parseDynamicTable(info, definition);
}
