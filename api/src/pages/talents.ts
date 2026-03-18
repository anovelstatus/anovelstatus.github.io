import {
	getNumbersLessThanLimit,
	getNumberIfLessThanLimit,
	parseId,
	parseFormattedTable,
	getChapterFilter,
	parseRichText,
} from "./shared";

type Columns = Record<keyof Talent | "id", number>;

/** Get list of Talents and their metadata */
export const getTalents: CacheableFunc<Talent[]> = (ss, _ranges, _attributes, chapterLimit) => {
	const range = ss.getSheetByName("Talents")!.getDataRange();
	return parseFormattedTable(
		range,
		mapColumns,
		(row, richRow, headers) => mapRow(row, richRow, headers, chapterLimit),
		getChapterFilter(chapterLimit, "chapterGained"),
	);
};

function mapColumns(headerRow: SpreadsheetValue[]): Columns {
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

function mapRow(row: SpreadsheetValue[], richRow: RichValue[], headers: Columns, chapterLimit: number): Talent {
	const previous: string[] = row[headers.previous] ? (row[headers.previous] as string).split(", ") : [];
	const previousLinks = previous.map(parseId);

	return {
		name: row[headers.name] as string,
		tier: row[headers.tier] as string,
		growth: row[headers.growth] as boolean,
		note: parseRichText(richRow[headers.note]),
		chapterGained: row[headers.chapterGained] as number,
		previous: previousLinks,
		chapterUndone: getNumberIfLessThanLimit(row[headers.chapterUndone], chapterLimit),
		chapterReplaced: getNumbersLessThanLimit(row[headers.chapterReplaced], chapterLimit),
		temporary: row[headers.temporary] as boolean,
		type: row[headers.type] as TalentType,
	};
}
