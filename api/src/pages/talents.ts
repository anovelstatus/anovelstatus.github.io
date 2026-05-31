import { chapterFilter, getEntireSheet, mapTable } from "./shared";

export function getTalents(info: SpreadsheetInfo) {
	const range = getEntireSheet(info, "Talents");
	const fields: Fields<Talent> = [
		{ key: "name", source: { type: "exact", name: "Name" }, parse: "string" },
		{ key: "tier", source: { type: "exact", name: "Tier" }, parse: "string" },
		{ key: "chapterGained", source: { type: "exact", name: "Chapter Gained" }, parse: "number" },
		{ key: "chapterUndone", source: { type: "exact", name: "Chapter Undone" }, parse: "number", limited: true },
		{
			key: "chapterReplaced",
			source: { type: "exact", name: "Chapters Replaced" },
			parse: "split_number",
			limited: true,
		},
		{ key: "note", source: { type: "exact", name: "Description" }, parse: "rich" },
		{ key: "previous", source: { type: "exact", name: "Previous" }, parse: "split_tiered_id" },
		{ key: "type", source: { type: "exact", name: "Type" }, parse: "string" },
		{ key: "growth", source: { type: "exact", name: "Growth" }, parse: "bool", optional: true },
		{ key: "temporary", source: { type: "exact", name: "Temporary" }, parse: "bool", optional: true },
	];
	return mapTable(info, range, fields).filter(chapterFilter(info.chapterLimit, "chapterGained"));
}
