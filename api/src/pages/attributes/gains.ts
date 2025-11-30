type InternalGain = Attribute.Gain;
type Columns = Record<keyof InternalGain, number>;

export const getGains: CacheableFunc<InternalGain[]> = (ss, _ranges, _attributes, chapterLimit) => {
	const data = ss.getSheetByName("Stat Gains")!.getDataRange().getValues();
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
		gain: headerRow.indexOf("Gain"),
		note: headerRow.indexOf("How / Why"),
	};
}

function mapRow(row: SpreadsheetValue[], headers: Columns): InternalGain {
	return {
		chapter: row[headers.chapter] as number,
		attribute: row[headers.attribute] as string,
		gain: row[headers.gain] as number,
		note: row[headers.note] as string,
	};
}
