import { chapterFilter, parseFormattedTable, parseId, parseRichText } from "../shared";

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
		boost: headerRow.findIndex((x) => (x as string).includes("Gain")),
		title: headerRow.indexOf("Title"),
		note: headerRow.indexOf("Note"),
	};
}

function mapRow(row: SpreadsheetValue[], richRow: RichValue[], headers: Columns): InternalBoost {
	return {
		chapter: row[headers.chapter] as number,
		attribute: row[headers.attribute] as string,
		boost: row[headers.boost] as number,
		title: parseId(row[headers.title] as string),
		note: parseRichText(richRow[headers.note]),
	};
}
