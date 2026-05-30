import { chapterFilter, parseDynamicTable } from "./shared";

export function getTalents(info: SpreadsheetInfo) {
	const definition: Table<Talent> = {
		getRange: (info) => info.ss.getSheetByName("Talents")!.getDataRange(),
		filter: chapterFilter(info.chapterLimit, "chapterGained"),
		fields: [
			{ key: "name", source: { type: "column", name: "Name" }, parse: { type: "string" } },
			{ key: "tier", source: { type: "column", name: "Tier" }, parse: { type: "string" } },
			{ key: "chapterGained", source: { type: "column", name: "Chapter Gained" }, parse: { type: "number" } },
			{
				key: "chapterUndone",
				source: { type: "column", name: "Chapter Undone" },
				parse: { type: "number", limited: true },
			},
			{
				key: "chapterReplaced",
				source: { type: "column", name: "Chapters Replaced" },
				parse: { type: "split-number", limited: true },
			},
			{ key: "note", source: { type: "column", name: "Description" }, parse: { type: "rich" } },
			{ key: "previous", source: { type: "column", name: "Previous" }, parse: { type: "split_tiered_id" } },
			{ key: "type", source: { type: "column", name: "Type" }, parse: { type: "string" } },

			{ key: "growth", source: { type: "column", name: "Growth" }, parse: { type: "bool", optional: true } },
			{ key: "temporary", source: { type: "column", name: "Temporary" }, parse: { type: "bool", optional: true } },
		],
		extra: undefined,
	};
	return parseDynamicTable(info, definition);
}
