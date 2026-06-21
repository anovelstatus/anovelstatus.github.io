import { chapterFilter, getEntireSheet, mapTable } from "../parser";

type InternalSkillGain = SkillGain & { id: string };

export function getSkills(info: SpreadsheetInfo) {
	const skillLevels = getLevels(info);

	const range = getEntireSheet(info, "Skill List");
	const fields: Fields<Skill> = [
		{ key: "name|tier", source: { type: "exact", name: "Name" }, parse: "tiered_id" },
		{ key: "previous", source: { type: "contains", contains: "Previous" }, parse: "split_tiered_id" },
		{
			key: "chReplaced",
			source: { type: "exact", name: "Chapter Replaced" },
			parse: "number",
			optional: true,
			limited: true,
		},
		{ key: "description", source: { type: "exact", name: "Description" }, parse: "rich" },
		{ key: "prerequisites", source: { type: "exact", name: "Prerequisites" }, parse: "string", optional: true },
		{ key: "quality", source: { type: "exact", name: "Quality" }, parse: "string" },
		{ key: "bonuses", source: { type: "exact", name: "Bonus" }, parse: "rich" },
		{ key: "notes", source: { type: "exact", name: "Note" }, parse: "rich" },
		{ key: "tags", source: { type: "exact", name: "Tags" }, parse: "split_string", optional: true },
		{ key: "adjustment", source: { type: "contains", contains: "Adjustment" }, parse: "number", optional: true },
		{ key: "attributes", parse: "attributes" },
		// Must process after tier and name
		{
			key: "gains",
			parse: ({ rowSoFar }) => {
				const id = rowSoFar.name + " - " + rowSoFar.tier;
				return skillLevels
					.filter((x) => x.id === id)
					.map((x): SkillGain => ({ note: x.note, chapter: x.chapter, count: x.count }));
			},
		},
	];

	return mapTable(info, range, fields).filter((x) => !!x.name && x.gains.length > 0);
}

function getLevels(info: SpreadsheetInfo) {
	const range = getEntireSheet(info, "Skill Levels");
	const fields: Fields<InternalSkillGain> = [
		{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
		{ key: "id", source: { type: "exact", name: "Skill - Tier" }, parse: "string" },
		{ key: "count", source: { type: "exact", name: "# of Levels" }, parse: "number" },
		{ key: "note", source: { type: "contains", contains: "Levels gained" }, parse: "string" },
	];
	return mapTable(info, range, fields, 1).filter(chapterFilter(info.chapterLimit, "chapter"));
}
