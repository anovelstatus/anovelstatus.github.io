type Columns = Record<keyof Shortcut, number>;

export const getTimelineShortcuts: CacheableFunc<Shortcut[]> = (ss, ranges, _attributes, chapterLimit) => {
	const data = ss.getRange(ranges["Chapter Shortcuts"]).getValues();
	const headers = mapColumns(data[0]!);

	return data
		.slice(1)
		.filter((x) => x[0])
		.map((row) => mapRow(row, headers))
		.filter((x) => x.chapter <= chapterLimit);
};

function mapColumns(headerRow: string[]): Columns {
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
