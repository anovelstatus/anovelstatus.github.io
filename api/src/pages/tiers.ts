import { parseDynamicTable } from "./shared";

export function getTiers(info: SpreadsheetInfo) {
	const definition: Table<TierInfo> = {
		range: info.ss.getSheetByName("Talents")!.getDataRange(),
		fields: [
			{ key: "tier", source: { type: "exact", name: "Tier" }, parse: { type: "string" } },
			{ key: "skillName", source: { type: "exact", name: "Skill" }, parse: { type: "string" } },
			{ key: "metalName", source: { type: "exact", name: "Metal" }, parse: { type: "string" } },
			{
				key: "chapterRevealed",
				source: { type: "exact", name: "Chapter Revealed" },
				parse: { type: "number", optional: true },
			},
			{ key: "fgColor", source: { type: "exact", name: "Foreground" }, parse: { type: "string" } },
			{ key: "bgColor", source: { type: "exact", name: "Background" }, parse: { type: "string" } },
		],
		extra: undefined,
	};
	const table = parseDynamicTable(info, definition);
	// Suppress unknown knowledge
	for (const row of table) {
		if (row.chapterRevealed && row.chapterRevealed > info.chapterLimit) {
			row.metalName = "?";
			row.skillName = "?";
		}
	}
	return table;
}
