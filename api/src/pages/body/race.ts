import { parseRichText, parseFormattedTable, chapterFilter, parseNumber, parseString, parseIds } from "../shared";

type Columns = Record<keyof Race, number>;

export const getRaces: StandardParser<Race[]> = ({ ss, ranges, chapterLimit }) => {
	return parseFormattedTable(ss.getRange(ranges.Races), mapColumns, mapRow, chapterFilter(chapterLimit, "chapter"));
};

function mapColumns(headerRow: SpreadsheetValue[]): Columns {
	return {
		name: headerRow.indexOf("Race"),
		chapter: headerRow.indexOf("Chapter"),
		tier: headerRow.indexOf("Tier"),
		talents: headerRow.indexOf("Talents"),
		note: headerRow.indexOf("Description"),
		freeSlots: headerRow.indexOf("Free Slots"),
	};
}

function mapRow(row: SpreadsheetValue[], richRow: RichValue[], headers: Columns): Race {
	return {
		name: parseString(row[headers.name]),
		chapter: parseNumber(row[headers.chapter]),
		tier: parseNumber(row[headers.tier]),
		talents: parseIds(row[headers.talents]),
		freeSlots: parseNumber(row[headers.freeSlots]),
		note: parseRichText(richRow[headers.note]),
	};
}
