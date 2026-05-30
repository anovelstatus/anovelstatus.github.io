import { chapterFilter, parseNumber, parseString, parseTable } from "../shared";

export type InternalSkillGain = SkillGain & { id: string };
type Columns = Record<keyof InternalSkillGain, number>;

export function getLevels({ ss, ranges, chapterLimit }: SpreadsheetInfo): InternalSkillGain[] {
	const range = ss.getRange(ranges["Skill Levels"]);
	return parseTable(range, mapColumns, mapRow, chapterFilter(chapterLimit, "chapter"));
}

function mapColumns(headerRow: SpreadsheetValue[]): Columns {
	return {
		chapter: headerRow.indexOf("Chapter"),
		id: headerRow.indexOf("Skill - Tier"),
		count: headerRow.indexOf("# of Levels"),
		note: headerRow.findIndex((x) => typeof x === "string" && x.startsWith("Levels gained")),
	};
}

function mapRow(row: SpreadsheetValue[], headers: Columns): InternalSkillGain {
	return {
		id: parseString(row[headers.id]),
		count: parseNumber(row[headers.count]),
		note: parseString(row[headers.note]),
		chapter: parseNumber(row[headers.chapter]),
	};
}
