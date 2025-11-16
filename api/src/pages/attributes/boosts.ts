type InternalBoost = Attribute.Boost & { attribute: string };
type Columns = Record<keyof InternalBoost, number>;

export const getBoosts: CacheableFunc<InternalBoost[]> = (ss, ranges, _attributes, chapterLimit) => {
	const data = ss.getRange(ranges["Attribute Boosts"]).getValues();
	const headers = mapColumns(data[0]!);

	return data
		.slice(1)
		.map((row) => mapRow(row, headers))
		.filter((x) => x.chapter <= chapterLimit);
};

function mapColumns(headerRow: string[]): Columns {
	return {
		chapter: headerRow.indexOf("Chapter"),
		attribute: headerRow.indexOf("Attribute"),
		boost: headerRow.findIndex((x) => (x as string).includes("Gain")),
		title: headerRow.indexOf("Title"),
		note: headerRow.indexOf("Note"),
	};
}

function mapRow(row: SpreadsheetValue[], headers: Columns): InternalBoost {
	return {
		chapter: row[headers.chapter] as number,
		attribute: row[headers.attribute] as string,
		boost: row[headers.boost] as number,
		title: row[headers.title] as string,
		note: row[headers.note] as string,
	};
}
