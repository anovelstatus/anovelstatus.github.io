import { getChapterFilter, parseFormattedTable, parseRichText } from "./shared";

type Columns = Omit<Record<keyof LoreEntry, number>, "note2">;

export const getLore: CacheableFunc<Lore> = (ss, _ranges, _attributes, chapterLimit) => {
	const descriptions = parseFormattedTable(
		ss.getSheetByName("Lore")!.getDataRange(),
		mapColumns,
		mapRow,
		getChapterFilter(chapterLimit, "chapter"),
	);
	const updates = parseFormattedTable(
		ss.getSheetByName("Updates")!.getDataRange(),
		mapColumns,
		mapRow,
		getChapterFilter(chapterLimit, "chapter"),
	);
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
		note: row[headers.note] as string | undefined,
		note2: parseRichText(richRow[headers.note]),
	};
}
