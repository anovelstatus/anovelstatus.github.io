import { chapterFilter, getEntireSheet, mapTable } from "./shared";

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
	const range = getEntireSheet(info, "Timeline");
	const fields: Fields<Shortcut> = [
		{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
		{ key: "label", source: { type: "exact", name: "Label" }, parse: "string" },
		{ key: "group", source: { type: "exact", name: "Group" }, parse: "string", optional: true },
		{ key: "menu", source: { type: "exact", name: "Menu" }, parse: "string", optional: true },
	];
	return mapTable(info, range, fields).filter(chapterFilter(info.chapterLimit, "chapter"));
}

function getTiers(info: SpreadsheetInfo) {
	const range = getEntireSheet(info, "Tiers");
	const fields: Fields<TierInfo> = [
		{ key: "tier", source: { type: "exact", name: "Tier" }, parse: "number" },
		{ key: "skillName", source: { type: "exact", name: "Skill" }, parse: "string" },
		{ key: "metalName", source: { type: "exact", name: "Metal" }, parse: "string" },
		{ key: "chapterRevealed", source: { type: "exact", name: "Chapter Revealed" }, parse: "number", optional: true },
		{ key: "fgColor", source: { type: "exact", name: "Foreground" }, parse: "string" },
		{ key: "bgColor", source: { type: "exact", name: "Background" }, parse: "string" },
	];
	const table = mapTable(info, range, fields);
	// Suppress future knowledge
	for (const row of table) {
		if (row.chapterRevealed && row.chapterRevealed > info.chapterLimit) {
			row.metalName = "?";
			row.skillName = "?";
		}
	}
	return table;
}
