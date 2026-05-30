import {
	chapterFilter,
	parseFormattedTable,
	parseNumber,
	parseRichText,
	parseSplitString,
	parseString,
} from "./shared";

type Columns = Record<keyof Achievement, number>;

export const getAchievements: StandardParser<Achievement[]> = ({ ss, chapterLimit }) => {
	const range = ss.getSheetByName("Achievements")!.getDataRange();
	return parseFormattedTable(range, mapColumns, mapRow, chapterFilter(chapterLimit, "chapter"));
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
		chapter: parseNumber(row[headers.chapter]),
		tier: parseString(row[headers.tier]),
		description: parseRichText(richRow[headers.description]),
		message: parseRichText(richRow[headers.message]),
		messageRecipients: parseSplitString(row[headers.messageRecipients], ","),
		rewards: parseRichText(richRow[headers.rewards]),
		note: parseRichText(richRow[headers.note]),
	};
}
