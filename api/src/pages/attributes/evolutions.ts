type InternalEvolution = Attribute.Evolution & { attribute: string };
type Columns = Record<keyof InternalEvolution, number>;

export const getEvolutions: CacheableFunc<InternalEvolution[]> = (ss, ranges, _attributes, chapterLimit) => {
	const data = ss.getRange(ranges["Attribute Evolutions"]).getValues();
	const headers = mapColumns(data[0]!);

	return data
		.slice(1)
		.map((row) => mapRow(row, headers))
		.filter((x) => x.chapter <= chapterLimit);
};

function mapColumns(headerRow: string[]): Columns {
	return {
		attribute: headerRow.indexOf("Attribute"),
		name: headerRow.indexOf("Evolution"),
		chapter: headerRow.indexOf("Chapter"),
		note: headerRow.indexOf("Description"),
	};
}

function mapRow(row: SpreadsheetValue[], headers: Columns): InternalEvolution {
	return {
		chapter: row[headers.chapter] as number,
		attribute: row[headers.attribute] as string,
		note: row[headers.note] as string,
		name: row[headers.name] as string,
	};
}
