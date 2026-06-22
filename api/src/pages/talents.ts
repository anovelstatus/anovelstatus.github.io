import { chapterFilter, getEntireSheet, limitValue, limitValues, mapTable } from "../parser";

export function getTalents(info: SpreadsheetInfo) {
	const range = getEntireSheet(info, "Talents");
	const fields: Fields<Talent> = [
		{ key: "name|tier", source: { type: "exact", name: "Talent" }, parse: "tiered_id" },
		{ key: "chapterGained", source: { type: "exact", name: "Chapter Gained" }, parse: "number" },
		{ key: "chapterUndone", source: { type: "exact", name: "Chapter Undone" }, parse: "number", optional: true },
		{
			key: "chapterReplaced",
			source: { type: "exact", name: "Chapters Replaced" },
			parse: "split_number",
			optional: true,
		},
		{ key: "note", source: { type: "exact", name: "Description" }, parse: "rich" },
		{ key: "previous", source: { type: "exact", name: "Previous" }, parse: "split_tiered_id" },
		{ key: "type", source: { type: "exact", name: "Type" }, parse: "string" },
		{ key: "growth", source: { type: "exact", name: "Growth" }, parse: "bool", optional: true },
		{ key: "temporary", source: { type: "exact", name: "Temporary" }, parse: "bool", optional: true },
	];
	return mapTable(info, range, fields);
}

export function limitTalents(data: Talent[], info: LimiterInfo) {
	return data.filter(chapterFilter(info.chapterLimit, "chapterGained")).map((talent) => {
		return {
			...talent,
			chapterUndone: limitValue(talent.chapterUndone, info.chapterLimit),
			chapterReplaced: limitValues(talent.chapterReplaced, info.chapterLimit),
		};
	});
}
