import { getNumbersLessThanLimit, getNumberIfLessThanLimit, parseId } from "./shared";

type Columns = Record<keyof Talent | "id", number>;

/** Get list of Talents and their metadata */
export const getTalents: CacheableFunc<Talent[]> = (ss, _ranges, _attributes, chapterLimit) => {
	const data = ss.getSheetByName("Talents")!.getDataRange().getValues();
	const headers = mapColumns(data[0]!);

	return data
		.slice(1)
		.map((row) => mapRow(row, headers, chapterLimit))
		.filter((x) => x.name !== "" && x.chapterGained <= chapterLimit);
};

function mapColumns(headerRow: string[]): Columns {
	return {
		id: headerRow.indexOf("Title"),
		name: headerRow.indexOf("Name"),
		tier: headerRow.indexOf("Tier"),
		chapterGained: headerRow.indexOf("Chapter Gained"),
		chapterUndone: headerRow.indexOf("Chapter Undone"),
		chapterReplaced: headerRow.indexOf("Chapters Replaced"),
		note: headerRow.indexOf("Description"),
		growth: headerRow.indexOf("Growth"),
		type: headerRow.indexOf("Type"),
		previous: headerRow.indexOf("Previous"),
		temporary: headerRow.indexOf("Temporary"),
	};
}

function mapRow(row: SpreadsheetValue[], headers: Columns, chapterLimit: number): Talent {
	const previous: string[] = row[headers.previous] ? (row[headers.previous] as string).split(", ") : [];
	const previousLinks = previous.map(parseId);

	return {
		name: row[headers.name] as string,
		tier: row[headers.tier] as string,
		growth: row[headers.growth] as boolean,
		note: row[headers.note] as string,
		chapterGained: row[headers.chapterGained] as number,
		previous: previousLinks,
		chapterUndone: getNumberIfLessThanLimit(row[headers.chapterUndone], chapterLimit),
		chapterReplaced: getNumbersLessThanLimit(row[headers.chapterReplaced], chapterLimit),
		temporary: row[headers.temporary] as boolean,
		type: row[headers.type] as TalentType,
	};
}
