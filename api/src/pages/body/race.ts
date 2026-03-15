import { parseId, parseRichText, parseFormattedTable, getChapterFilter } from "../shared";

type Columns = Record<keyof Race, number>;

export const getRaces: CacheableFunc<Race[]> = (ss, ranges, _attributes, chapterLimit) => {
	return parseFormattedTable(ss.getRange(ranges.Races), mapColumns, mapRow, getChapterFilter(chapterLimit, "chapter"));
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
		name: row[headers.name] as string,
		chapter: row[headers.chapter] as number,
		tier: row[headers.tier] as number,
		talents: row[headers.talents] ? (row[headers.talents] as string).split(", ").map(parseId) : [],
		freeSlots: row[headers.freeSlots] as number,
		note: parseRichText(richRow[headers.note]),
	};
}
