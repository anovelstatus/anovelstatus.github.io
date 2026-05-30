import { chapterFilter, parseDynamicTable } from "./shared";

export function getTalents(info: SpreadsheetInfo) {
	const definition: Table<Talent> = {
		range: info.ss.getSheetByName("Talents")!.getDataRange(),
		filter: chapterFilter(info.chapterLimit, "chapterGained"),
		fields: [
			{ key: "name", source: { type: "exact", name: "Name" }, parse: { type: "string" } },
			{ key: "tier", source: { type: "exact", name: "Tier" }, parse: { type: "string" } },
			{ key: "chapterGained", source: { type: "exact", name: "Chapter Gained" }, parse: { type: "number" } },
			{
				key: "chapterUndone",
				source: { type: "exact", name: "Chapter Undone" },
				parse: { type: "number", limited: true },
			},
			{
				key: "chapterReplaced",
				source: { type: "exact", name: "Chapters Replaced" },
				parse: { type: "split_number", limited: true },
			},
			{ key: "note", source: { type: "exact", name: "Description" }, parse: { type: "rich" } },
			{ key: "previous", source: { type: "exact", name: "Previous" }, parse: { type: "split_tiered_id" } },
			{ key: "type", source: { type: "exact", name: "Type" }, parse: { type: "string" } },

			{ key: "growth", source: { type: "exact", name: "Growth" }, parse: { type: "bool", optional: true } },
			{ key: "temporary", source: { type: "exact", name: "Temporary" }, parse: { type: "bool", optional: true } },
		],
	};
	return parseDynamicTable(info, definition);
}
