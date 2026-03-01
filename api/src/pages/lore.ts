type Columns = Record<keyof LoreEntry, number>;

export const getLore: CacheableFunc<Lore> = (ss, _ranges, _attributes, chapterLimit) => {
	const descriptionData = ss.getSheetByName("Lore")!.getDataRange().getValues();
	const descriptionHeaders = mapColumns(descriptionData[0]!);

	const descriptions = descriptionData
		.slice(1)
		.filter((x) => x[0])
		.map((row) => mapRow(row, descriptionHeaders))
		.filter((x) => x.chapter <= chapterLimit);

	const updateData = ss.getSheetByName("Updates")!.getDataRange().getValues();
	const updateHeaders = mapColumns(updateData[0]!);

	const updates = updateData
		.slice(1)
		.filter((x) => x[0])
		.map((row) => mapRow(row, updateHeaders))
		.filter((x) => x.chapter <= chapterLimit);

	return { descriptions, updates };
};

function mapColumns(headerRow: string[]): Columns {
	return {
		chapter: headerRow.indexOf("Chapter"),
		key: headerRow.indexOf("Key"),
		note: headerRow.indexOf("Text"),
	};
}

function mapRow(row: SpreadsheetValue[], headers: Columns): LoreEntry {
	return {
		chapter: row[headers.chapter] as number,
		key: row[headers.key] as string,
		note: row[headers.note] as string | undefined,
	};
}
