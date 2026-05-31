import { chapterFilter, mapTable } from "./shared";

export function getConfiguration(info: SpreadsheetInfo): BasicInfo {
	return {
		latest: info.chapterLimit,
		tiers: getTiers(info),
		unlocked: info.includePatreon,
		patreonSheetLink: info.includePatreon ? PATREON_SHEET : undefined,
		shortcuts: getTimelineShortcuts(info),
		attributes: info.attributes.map((x) => ({
			name: x.name,
			abbreviation: x.abbreviation,
			category: x.category,
			categoryAbbreviation: x.categoryAbbreviation,
		})),
	};
}

function getTimelineShortcuts(info: SpreadsheetInfo) {
	const definition: Table<Shortcut> = {
		range: info.ss.getRange(info.ranges["Chapter Shortcuts"]),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: { type: "number" } },
			{ key: "label", source: { type: "exact", name: "Label" }, parse: { type: "string" } },
			{ key: "group", source: { type: "exact", name: "Group" }, parse: { type: "string", optional: true } },
			{ key: "menu", source: { type: "exact", name: "Menu" }, parse: { type: "string", optional: true } },
		],
	};
	return mapTable(info, definition);
}

function getTiers(info: SpreadsheetInfo) {
	const definition: Table<TierInfo> = {
		range: info.ss.getSheetByName("Tiers")!.getDataRange(),
		fields: [
			{ key: "tier", source: { type: "exact", name: "Tier" }, parse: { type: "number" } },
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
	};
	const table = mapTable(info, definition);
	// Suppress future knowledge
	for (const row of table) {
		if (row.chapterRevealed && row.chapterRevealed > info.chapterLimit) {
			row.metalName = "?";
			row.skillName = "?";
		}
	}
	return table;
}
