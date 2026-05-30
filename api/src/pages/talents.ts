import {
	getNumbersLessThanLimit,
	getNumberIfLessThanLimit,
	parseFormattedTable,
	chapterFilter,
	parseRichText,
	parseNumber,
	parseOptional,
	parseString,
	parseIds,
} from "./shared";

type Columns = Record<keyof Talent | "id", number>;

/** Get list of Talents and their metadata */
export const getTalents: StandardParser<Talent[]> = ({ ss, chapterLimit }) => {
	const range = ss.getSheetByName("Talents")!.getDataRange();
	return parseFormattedTable(range, mapColumns, mapRow, chapterFilter(chapterLimit, "chapterGained"), chapterLimit);
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
	return {
		name: parseString(row[headers.name]),
		tier: parseString(row[headers.tier]),
		growth: parseOptional<boolean>(row[headers.growth]),
		note: parseRichText(richRow[headers.note]),
		chapterGained: parseNumber(row[headers.chapterGained]),
		previous: parseIds(row[headers.previous]),
		chapterUndone: getNumberIfLessThanLimit(row[headers.chapterUndone], chapterLimit),
		chapterReplaced: getNumbersLessThanLimit(row[headers.chapterReplaced], chapterLimit),
		temporary: parseOptional<boolean>(row[headers.temporary]),
		type: parseString(row[headers.type]),
	};
}
