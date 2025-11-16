import { parseId } from "./shared";

type Columns = Omit<Record<keyof Title | "title" | "chapterReplaced", number>, keyof TieredId>;

/** Get list of Titles and their metadata. This does NOT include metadata for attribute boosts. That is loaded separately. */
export const getTitles: CacheableFunc<Title[]> = (ss, ranges, _attributes, chapterLimit) => {
	const range = ranges.Titles;
	const data = ss.getRange(range).getValues();
	const headers = mapColumns(data[0]!);

	return data
		.slice(1)
		.map((row) => mapRow(row, headers, chapterLimit))
		.filter((x) => x.chapter <= chapterLimit && x.chapter);
};

function mapColumns(headerRow: string[]): Columns {
	return {
		title: headerRow.indexOf("Title"),
		note: headerRow.indexOf("Description"),
		chapter: headerRow.indexOf("Chapter"),
		previous: headerRow.indexOf("Previous"),
		replaced: headerRow.indexOf("Replaced"),
		chapterReplaced: headerRow.indexOf("Chapter Replaced"),
	};
}

function mapRow(row: SpreadsheetValue[], headers: Columns, chapterLimit: number): Title {
	const id = parseId(row[headers.title] as string);

	const previous = row[headers.previous] ? parseId(row[headers.previous] as string) : undefined;

	let chapterReplaced = row[headers.chapterReplaced] as number | undefined;
	if (chapterReplaced && chapterReplaced >= chapterLimit) chapterReplaced = undefined;

	return {
		...id,
		note: row[headers.note] as string,
		chapter: row[headers.chapter] as number,
		previous: previous,
		replaced: chapterReplaced,
	};
}
