import { chapterFilter, getEntireSheet, limitValue, mapTable } from "../parser";

/** Get list of Titles and their metadata. This does NOT include metadata for attribute boosts. That is loaded separately. */
export function getTitles(info: SpreadsheetInfo) {
	const range = getEntireSheet(info, "Titles");
	const fields: Fields<Title> = [
		{ key: "name|tier", source: { type: "exact", name: "Title" }, parse: "tiered_id" },
		{ key: "note", source: { type: "exact", name: "Description" }, parse: "rich" },
		{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
		{ key: "previous", source: { type: "exact", name: "Previous" }, parse: "tiered_id", optional: true },
		{ key: "replaced", source: { type: "exact", name: "Chapter Replaced" }, parse: "number", optional: true },
	];

	return mapTable(info, range, fields);
}

export function limitTitles(data: Title[], info: LimiterInfo) {
	return data.filter(chapterFilter(info.chapterLimit, "chapter")).map((x) => {
		return {
			...x,
			replaced: limitValue(x.replaced, info.chapterLimit),
		};
	});
}
