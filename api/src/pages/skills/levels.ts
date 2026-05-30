import { chapterFilter, parseDynamicTable } from "../shared";

export type InternalSkillGain = SkillGain & { id: string };

export function getLevels(info: SpreadsheetInfo) {
	const definition: Table<InternalSkillGain> = {
		range: info.ss.getRange(info.ranges["Skill Levels"]),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: { type: "number" } },
			{ key: "id", source: { type: "exact", name: "Skill - Tier" }, parse: { type: "string" } },
			{ key: "count", source: { type: "exact", name: "# of Levels" }, parse: { type: "number" } },
			{ key: "note", source: { type: "contains", contains: "Levels gained" }, parse: { type: "string" } },
		],
		extra: undefined,
	};
	return parseDynamicTable(info, definition);
}
