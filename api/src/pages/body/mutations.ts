import { getNumbersLessThanLimit } from "../shared";

type Columns = Record<keyof Body.Modification, number>;

export const getMutations: CacheableFunc<Body.Modification[]> = (ss, ranges, _attributes, chapterLimit) => {
	const range = ranges.Mutations;
	const data = ss.getRange(range).getValues();
	const headers = mapColumns(data[0]!);

	return data
		.slice(1)
		.map((row) => mapRow(row, headers, chapterLimit))
		.filter((x) => x.chapters.length > 0);
};

function mapColumns(headerRow: string[]): Columns {
	return {
		name: headerRow.indexOf("Mutation"),
		chapters: headerRow.indexOf("Chapters"),
		tier: headerRow.indexOf("Rarity"),
		type: headerRow.indexOf("Type"),
		note: headerRow.indexOf("Description"),
		source: headerRow.indexOf("Source"),
	};
}

function mapRow(row: SpreadsheetValue[], headers: Columns, chapterLimit: number): Body.Modification {
	return {
		name: row[headers.name] as string,
		chapters: getNumbersLessThanLimit(row[headers.chapters], chapterLimit),
		tier: row[headers.tier] as string,
		type: row[headers.type] as string,
		note: row[headers.note] as string,
		source: row[headers.source] as string,
	};
}
