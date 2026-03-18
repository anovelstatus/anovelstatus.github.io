import { getChapterFilter, parseFormattedTable, parseRichText } from "../shared";

export type InternalEvolution = Attribute.Evolution & { attribute: string };
type Columns = Record<keyof InternalEvolution, number>;

export const getEvolutions: CacheableFunc<InternalEvolution[]> = (ss, ranges, _attributes, chapterLimit) => {
	const range = ss.getRange(ranges["Attribute Evolutions"]);
	return parseFormattedTable(range, mapColumns, mapRow, getChapterFilter(chapterLimit, "chapter"));
};

function mapColumns(headerRow: SpreadsheetValue[]): Columns {
	return {
		attribute: headerRow.indexOf("Attribute"),
		name: headerRow.indexOf("Evolution"),
		chapter: headerRow.indexOf("Chapter"),
		note: headerRow.indexOf("Description"),
	};
}

function mapRow(row: SpreadsheetValue[], richRow: RichValue[], headers: Columns): InternalEvolution {
	return {
		chapter: row[headers.chapter] as number,
		attribute: row[headers.attribute] as string,
		note: parseRichText(richRow[headers.note]),
		name: row[headers.name] as string,
	};
}
