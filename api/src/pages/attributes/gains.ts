import { chapterFilter, parseFormattedTable, parseNumber, parseRichText, parseString } from "../shared";

export type InternalGain = Attribute.Gain & { attribute: string };
type Columns = Record<keyof InternalGain, number>;

export const getGains: StandardParser<InternalGain[]> = ({ ss, chapterLimit }) => {
	const range = ss.getSheetByName("Stat Gains")!.getDataRange();
	return parseFormattedTable(range, mapColumns, mapRow, chapterFilter(chapterLimit, "chapter"));
};

function mapColumns(headerRow: SpreadsheetValue[]): Columns {
	return {
		chapter: headerRow.indexOf("Chapter"),
		attribute: headerRow.indexOf("Attribute"),
		gain: headerRow.indexOf("Gain"),
		note: headerRow.indexOf("How / Why"),
	};
}

function mapRow(row: SpreadsheetValue[], richRow: RichValue[], headers: Columns): InternalGain {
	return {
		chapter: parseNumber(row[headers.chapter]),
		attribute: parseString(row[headers.attribute]),
		gain: parseNumber(row[headers.gain]),
		note: parseRichText(richRow[headers.note]),
	};
}
