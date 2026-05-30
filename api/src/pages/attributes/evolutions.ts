import { chapterFilter, parseFormattedTable, parseNumber, parseRichText, parseString } from "../shared";

export type InternalEvolution = Attribute.Evolution & { attribute: string };
type Columns = Record<keyof InternalEvolution, number>;

export const getEvolutions: StandardParser<InternalEvolution[]> = ({ ss, ranges, chapterLimit }) => {
	const range = ss.getRange(ranges["Attribute Evolutions"]);
	return parseFormattedTable(range, mapColumns, mapRow, chapterFilter(chapterLimit, "chapter"));
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
		chapter: parseNumber(row[headers.chapter]),
		attribute: parseString(row[headers.attribute]),
		note: parseRichText(richRow[headers.note]),
		name: parseString(row[headers.name]),
	};
}
