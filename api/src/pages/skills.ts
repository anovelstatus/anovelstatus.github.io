import { chapterFilter, mapTable, parseString } from "./shared";

type InternalSkillGain = SkillGain & { id: string };

export function getSkills(info: SpreadsheetInfo) {
	const skillLevels = getLevels(info);

	const definition: Table<Skill> = {
		range: info.ss.getSheetByName("Skill List")!.getDataRange(),
		filter: (x) => !!x.name && x.gains.length > 0,
		fields: [
			{ key: "tier", source: { type: "exact", name: "Tier" }, parse: "string" },
			{ key: "previous", source: { type: "contains", contains: "Previous" }, parse: "split_tiered_id" },
			{ key: "replaced", source: { type: "contains", contains: "Replaced" }, parse: "bool", optional: true },
			{ key: "description", source: { type: "exact", name: "Description" }, parse: "rich" },
			{ key: "prerequisites", source: { type: "exact", name: "Prerequisites" }, parse: "string", optional: true },
			{ key: "quality", source: { type: "exact", name: "Quality" }, parse: "string" },
			{ key: "bonuses", source: { type: "exact", name: "Bonus" }, parse: "rich" },
			{ key: "notes", source: { type: "exact", name: "Note" }, parse: "rich" },
			{ key: "tags", source: { type: "exact", name: "Tags" }, parse: "string", optional: true },
			// Must process after tier
			{
				key: "name",
				source: { type: "exact", name: "Name" },
				parse: ({ rowSoFar, value }) => {
					// Need to figure out how to get the generics working properly
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					return parseString(value).replace(" - " + rowSoFar.tier!, "") as any;
				},
			},
			// Must process after tier and name
			{
				key: "gains",
				parse: ({ rowSoFar }) => {
					const id = rowSoFar.name + " - " + rowSoFar.tier;
					return skillLevels
						.filter((x) => x.id === id)
						.map((x) => ({
							note: x.note,
							chapter: x.chapter,
							count: x.count,
							// Need to figure out how to get the generics working properly
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
						})) as any;
				},
			},
		],
	};
	for (const attribute of info.attributeNames) {
		definition.fields.push({
			key: attribute,
			source: { type: "exact", name: attribute },
			parse: "number",
			optional: true,
		});
	}

	return mapTable(info, definition);
}

function getLevels(info: SpreadsheetInfo) {
	const definition: Table<InternalSkillGain> = {
		range: info.ss.getRange(info.ranges["Skill Levels"]),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
			{ key: "id", source: { type: "exact", name: "Skill - Tier" }, parse: "string" },
			{ key: "count", source: { type: "exact", name: "# of Levels" }, parse: "number" },
			{ key: "note", source: { type: "contains", contains: "Levels gained" }, parse: "string" },
		],
	};
	return mapTable(info, definition);
}
