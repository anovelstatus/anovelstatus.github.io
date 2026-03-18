import { getChapterFilter, parseFormattedTable, parseRichText } from "../shared";

export type InternalGain = Attribute.Gain;
type Columns = Record<keyof InternalGain, number>;

export const getGains: CacheableFunc<InternalGain[]> = (ss, _ranges, _attributes, chapterLimit) => {
	const range = ss.getSheetByName("Stat Gains")!.getDataRange();
	return parseFormattedTable(range, mapColumns, mapRow, getChapterFilter(chapterLimit, "chapter"));
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
		chapter: row[headers.chapter] as number,
		attribute: row[headers.attribute] as string,
		gain: row[headers.gain] as number,
		note: parseRichText(richRow[headers.note]),
	};
}
