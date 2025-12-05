type Columns = Record<keyof Achievement, number>;

export const getAchievements: CacheableFunc<Achievement[]> = (ss, _ranges, _attributeNames, chapterLimit) => {
	const data = ss.getSheetByName("Achievements")!.getDataRange().getValues();
	const headers = mapColumns(data[0]!);

	return data
		.slice(1)
		.map((row) => mapRow(row, headers))
		.filter((x) => x.chapter && x.chapter <= chapterLimit);
};

function mapColumns(headerRow: string[]): Columns {
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

function mapRow(row: SpreadsheetValue[], headers: Columns): Achievement {
	return {
		chapter: row[headers.chapter] as number,
		tier: row[headers.tier] as string,
		description: row[headers.description] as string,
		message: row[headers.message] as string,
		messageRecipients: (row[headers.messageRecipients] as string)?.split(",").map((s) => s.trim()) || [],
		rewards: row[headers.rewards] as string,
		note: row[headers.note] as string,
	};
}
