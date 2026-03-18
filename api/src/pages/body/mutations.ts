import { getNumbersLessThanLimit, parseFormattedTable, parseRichText } from "../shared";

type Columns = Record<keyof Body.Modification, number>;

export const getMutations: CacheableFunc<Body.Modification[]> = (ss, ranges, _attributes, chapterLimit) => {
	return parseFormattedTable(
		ss.getRange(ranges.Mutations),
		mapColumns,
		(row, richRow, headers) => mapRow(row, richRow, headers, chapterLimit),
		(row) => row.chapters.length > 0,
	);
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
