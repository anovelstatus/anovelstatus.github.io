export type InternalSkillGain = SkillGain & { id: string };
type Columns = Record<keyof InternalSkillGain, number>;

export function getLevels(ss: Spreadsheet, ranges: RangeLookup, chapterLimit: number): InternalSkillGain[] {
	const data = ss.getRange(ranges["Skill Levels"]).getValues();
	const headers = mapColumns(data[0]!);

	return (
		data
			.slice(1)
			// make sure the row is actually filled out
			.filter((x) => x[1])
			.map((row) => mapRow(row, headers))
			.filter((x) => x.chapter <= chapterLimit)
	);
}

function mapColumns(headerRow: string[]): Columns {
	return {
		chapter: headerRow.indexOf("Chapter"),
		id: headerRow.indexOf("Skill - Tier"),
		count: headerRow.indexOf("# of Levels"),
		note: headerRow.findIndex((x) => x.startsWith("Levels gained")),
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
