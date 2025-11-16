import { parseId } from "../shared";

type Columns = Record<keyof Race, number>;

export const getRaces: CacheableFunc<Race[]> = (ss, ranges, _attributes, chapterLimit) => {
	const range = ranges.Races;
	const data = ss.getRange(range).getValues();
	const headers = mapColumns(data[0]!);

	return data
		.slice(1)
		.map((row) => mapRow(row, headers))
		.filter((x) => x.chapter <= chapterLimit);
};

function mapColumns(headerRow: string[]): Columns {
	return {
		name: headerRow.indexOf("Race"),
		chapter: headerRow.indexOf("Chapter"),
		tier: headerRow.indexOf("Tier"),
		talents: headerRow.indexOf("Talents"),
		note: headerRow.indexOf("Description"),
		freeSlots: headerRow.indexOf("Free Slots"),
	};
}

function mapRow(row: SpreadsheetValue[], headers: Columns): Race {
	return {
		name: row[headers.name] as string,
		chapter: row[headers.chapter] as number,
		tier: row[headers.tier] as number,
		talents: row[headers.talents] ? (row[headers.talents] as string).split(", ").map(parseId) : [],
		freeSlots: row[headers.freeSlots] as number,
		note: row[headers.note] as string,
	};
}
