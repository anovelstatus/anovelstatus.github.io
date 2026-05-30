import {
	chapterFilter,
	getNumberIfLessThanLimit,
	parseFormattedTable,
	parseId,
	parseNumber,
	parseOptionalId,
	parseRichText,
} from "./shared";

type Columns = Omit<Record<keyof Title | "title" | "chapterReplaced", number>, keyof TieredId>;

/** Get list of Titles and their metadata. This does NOT include metadata for attribute boosts. That is loaded separately. */
export const getTitles: StandardParser<Title[]> = ({ ss, ranges, chapterLimit }) => {
	const range = ss.getRange(ranges.Titles);
	return parseFormattedTable(range, mapColumns, mapRow, chapterFilter(chapterLimit, "chapter"), chapterLimit);
};

function mapColumns(headerRow: SpreadsheetValue[]): Columns {
	return {
		title: headerRow.indexOf("Title"),
		note: headerRow.indexOf("Description"),
		chapter: headerRow.indexOf("Chapter"),
		previous: headerRow.indexOf("Previous"),
		replaced: headerRow.indexOf("Replaced"),
		chapterReplaced: headerRow.indexOf("Chapter Replaced"),
	};
}

function mapRow(row: SpreadsheetValue[], richRow: RichValue[], headers: Columns, chapterLimit: number): Title {
	const id = parseId(row[headers.title]);
	return {
		...id,
		note: parseRichText(richRow[headers.note]),
		chapter: parseNumber(row[headers.chapter]),
		previous: parseOptionalId(row[headers.previous]),
		replaced: getNumberIfLessThanLimit(row[headers.chapterReplaced], chapterLimit),
	};
}
