import { getChapterFilter, parseFormattedTable, parseRichText } from "./shared";

type Columns = Record<keyof Achievement, number>;

export const getAchievements: CacheableFunc<Achievement[]> = (ss, _ranges, _attributeNames, chapterLimit) => {
	const range = ss.getSheetByName("Achievements")!.getDataRange();
	return parseFormattedTable(range, mapColumns, mapRow, getChapterFilter(chapterLimit, "chapter"));
};

function mapColumns(headerRow: SpreadsheetValue[]): Columns {
	return {
		chapter: headerRow.indexOf("Chapter"),
		tier: headerRow.indexOf("Tier"),
		description: headerRow.indexOf("Achievement"),
		message: headerRow.indexOf("Message"),
		messageRecipients: headerRow.indexOf("Message Recipients"),
		rewards: headerRow.indexOf("Rewards"),
		note: headerRow.indexOf("Other Notes"),
	};
}

function mapRow(row: SpreadsheetValue[], richRow: RichValue[], headers: Columns): Achievement {
	return {
		chapter: row[headers.chapter] as number,
		tier: row[headers.tier] as string,
		description: parseRichText(richRow[headers.description]),
		message: parseRichText(richRow[headers.message]),
		messageRecipients: (row[headers.messageRecipients] as string)?.split(",").map((s) => s.trim()) || [],
		rewards: parseRichText(richRow[headers.rewards]),
		note: parseRichText(richRow[headers.note]),
	};
}
