import { parseTable } from "./shared";

type Columns = Record<keyof Shortcut, number>;

export const getTimelineShortcuts: CacheableFunc<Shortcut[]> = (ss, ranges, _attributes, chapterLimit) => {
	const range = ss.getRange(ranges["Chapter Shortcuts"]);

	return parseTable(range, mapColumns, mapRow, (x) => x.chapter <= chapterLimit);
};

function mapColumns(headerRow: SpreadsheetValue[]): Columns {
	return {
		chapter: headerRow.indexOf("Chapter"),
		label: headerRow.indexOf("Label"),
		group: headerRow.indexOf("Group"),
		menu: headerRow.indexOf("Menu"),
	};
}

function mapRow(row: SpreadsheetValue[], headers: Columns): Shortcut {
	return {
		chapter: row[headers.chapter] as number,
		label: row[headers.label] as string,
		group: row[headers.group] as string | undefined,
		menu: row[headers.menu] as string | undefined,
	};
}
