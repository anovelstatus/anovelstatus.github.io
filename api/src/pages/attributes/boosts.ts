import { chapterFilter, parseFormattedTable, parseId, parseNumber, parseRichText, parseString } from "../shared";

export type InternalBoost = Attribute.Boost & { attribute: string };
type Columns = Record<keyof InternalBoost, number>;

export const getBoosts: StandardParser<InternalBoost[]> = ({ ss, ranges, chapterLimit }) => {
	const range = ss.getRange(ranges["Attribute Boosts"]);
	return parseFormattedTable(range, mapColumns, mapRow, chapterFilter(chapterLimit, "chapter"));
};

function mapColumns(headerRow: SpreadsheetValue[]): Columns {
	return {
		chapter: headerRow.indexOf("Chapter"),
		attribute: headerRow.indexOf("Attribute"),
		boost: headerRow.findIndex((x) => parseString(x).includes("Gain")),
		title: headerRow.indexOf("Title"),
		note: headerRow.indexOf("Note"),
	};
}

function mapRow(row: SpreadsheetValue[], richRow: RichValue[], headers: Columns): InternalBoost {
	return {
		chapter: parseNumber(row[headers.chapter]),
		attribute: parseString(row[headers.attribute]),
		boost: parseNumber(row[headers.boost]),
		title: parseId(row[headers.title]),
		note: parseRichText(richRow[headers.note]),
	};
}
