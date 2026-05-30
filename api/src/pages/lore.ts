import { chapterFilter, parseFormattedTable, parseRichText } from "./shared";

type Columns = Record<keyof LoreEntry, number>;

export const getLore: StandardParser<Lore> = ({ ss, chapterLimit }) => {
	const descRange = ss.getSheetByName("Lore")!.getDataRange();
	const descriptions = parseFormattedTable(descRange, mapColumns, mapRow, chapterFilter(chapterLimit, "chapter"));

	const updateRange = ss.getSheetByName("Updates")!.getDataRange();
	const updates = parseFormattedTable(updateRange, mapColumns, mapRow, chapterFilter(chapterLimit, "chapter"));
	return { descriptions, updates };
};

function mapColumns(headerRow: SpreadsheetValue[]): Columns {
	return {
		chapter: headerRow.indexOf("Chapter"),
		key: headerRow.indexOf("Key"),
		note: headerRow.indexOf("Text"),
	};
}

function mapRow(row: SpreadsheetValue[], richRow: RichValue[], headers: Columns): LoreEntry {
	return {
		chapter: row[headers.chapter] as number,
		key: row[headers.key] as string,
		note: parseRichText(richRow[headers.note]),
	};
}
