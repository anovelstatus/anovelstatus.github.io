import { chapterFilter, parseNumber, parseOptional, parseString, parseTable } from "./shared";

type Columns = Record<keyof Shortcut, number>;

export const getTimelineShortcuts: StandardParser<Shortcut[]> = ({ ss, ranges, chapterLimit }) => {
	const range = ss.getRange(ranges["Chapter Shortcuts"]);

	return parseTable(range, mapColumns, mapRow, chapterFilter(chapterLimit, "chapter"));
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
		chapter: parseNumber(row[headers.chapter]),
		label: parseString(row[headers.label]),
		group: parseOptional<string>(row[headers.group]),
		menu: parseOptional<string>(row[headers.menu]),
	};
}
