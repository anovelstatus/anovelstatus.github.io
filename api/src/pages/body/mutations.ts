import {
	getNumbersLessThanLimit,
	hasEntriesFilter,
	parseFormattedTable,
	parseOptional,
	parseRichText,
	parseString,
} from "../shared";

type Columns = Record<keyof Body.Modification, number>;

export const getMutations: StandardParser<Body.Modification[]> = ({ ss, ranges, chapterLimit }) => {
	const range = ss.getRange(ranges.Mutations);
	return parseFormattedTable(range, mapColumns, mapRow, hasEntriesFilter("chapters"), chapterLimit);
};

function mapColumns(headerRow: SpreadsheetValue[]): Columns {
	return {
		name: headerRow.indexOf("Mutation"),
		chapters: headerRow.indexOf("Chapters"),
		tier: headerRow.indexOf("Rarity"),
		type: headerRow.indexOf("Type"),
		note: headerRow.indexOf("Description"),
		source: headerRow.indexOf("Source"),
	};
}

function mapRow(
	row: SpreadsheetValue[],
	richRow: RichValue[],
	headers: Columns,
	chapterLimit: number,
): Body.Modification {
	return {
		name: parseString(row[headers.name]),
		chapters: getNumbersLessThanLimit(row[headers.chapters], chapterLimit),
		tier: parseOptional<string>(row[headers.tier]),
		type: parseString(row[headers.type]),
		note: parseOptional<string>(row[headers.note]),
		source: parseRichText(richRow[headers.source]!),
	};
}
