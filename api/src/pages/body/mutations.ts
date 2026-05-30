import { getNumbersLessThanLimit, hasEntriesFilter, parseFormattedTable, parseRichText } from "../shared";

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
		name: row[headers.name] as string,
		chapters: getNumbersLessThanLimit(row[headers.chapters], chapterLimit),
		tier: row[headers.tier] as string,
		type: row[headers.type] as string,
		note: row[headers.note] as string,
		source: parseRichText(richRow[headers.source]!),
	};
}
