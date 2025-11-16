type InternalBoost = Attribute.Milestone & { attribute: string };
type Columns = Record<keyof InternalBoost, number>;

export const getMilestones: CacheableFunc<InternalBoost[]> = (ss, ranges) => {
	const data = ss.getRange(ranges["Attribute Milestones"]).getValues();
	const headers = mapColumns(data[0]!);

	return data.slice(1).map((row) => mapRow(row, headers));
};

function mapColumns(headerRow: string[]): Columns {
	return {
		attribute: headerRow.indexOf("Attribute"),
		milestone: headerRow.indexOf("Milestone"),
		note: headerRow.indexOf("Description"),
	};
}

function mapRow(row: SpreadsheetValue[], headers: Columns): InternalBoost {
	return {
		attribute: row[headers.attribute] as string,
		note: row[headers.note] as string,
		milestone: row[headers.milestone] as number,
	};
}
