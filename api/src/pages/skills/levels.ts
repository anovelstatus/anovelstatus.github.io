import { getChapterFilter, parseTable } from "../shared";

export type InternalSkillGain = SkillGain & { id: string };
type Columns = Record<keyof InternalSkillGain, number>;

export function getLevels(ss: Spreadsheet, ranges: RangeLookup, chapterLimit: number): InternalSkillGain[] {
	const range = ss.getRange(ranges["Skill Levels"]);
	return parseTable(range, mapColumns, mapRow, getChapterFilter(chapterLimit, "chapter"));
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
		id: row[headers.id] as string,
		count: row[headers.count] as number,
		note: row[headers.note] as string,
		chapter: row[headers.chapter] as number,
	};
}
