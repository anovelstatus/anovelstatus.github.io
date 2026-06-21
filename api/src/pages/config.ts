import { chapterFilter, getEntireSheet, mapTable } from "../parser";

export function getConfiguration(info: SpreadsheetInfo): BasicInfo {
	return {
		latest: info.chapterLimit,
		tiers: getTiers(info),
		unlocked: true,
		patreonSheetLink: PATREON_SHEET,
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
	return mapTable(info, range, fields);
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
	return mapTable(info, range, fields);
}

export function limitConfiguration(data: BasicInfo, info: LimiterInfo): BasicInfo {
	return {
		latest: info.chapterLimit,
		tiers: limitTierNames(data.tiers, info.chapterLimit),
		attributes: data.attributes, //todo: limit
		shortcuts: data.shortcuts.filter(chapterFilter(info.chapterLimit, "chapter")),
		patreonSheetLink: info.includePatreon ? data.patreonSheetLink : undefined,
		unlocked: info.includePatreon,
	};
}

function limitTierNames(table: TierInfo[], chapter: number) {
	return table.map((row) => {
		const revealed = row.chapterRevealed && row.chapterRevealed > chapter;
		return {
			...row,
			metalName: revealed ? row.metalName : "?",
			skillName: revealed ? row.skillName : "?",
		};
	});
}
