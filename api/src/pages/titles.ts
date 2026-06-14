import { chapterFilter, getEntireSheet, mapTable } from "./shared";

/** Get list of Titles and their metadata. This does NOT include metadata for attribute boosts. That is loaded separately. */
export function getTitles(info: SpreadsheetInfo) {
	const range = getEntireSheet(info, "Titles");
	const fields: Fields<Title> = [
		{ key: "name|tier", source: { type: "exact", name: "Title" }, parse: "tiered_id" },
		{ key: "note", source: { type: "exact", name: "Description" }, parse: "rich" },
		{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
		{ key: "previous", source: { type: "exact", name: "Previous" }, parse: "tiered_id", optional: true },
		{
			key: "replaced",
			source: { type: "exact", name: "Chapter Replaced" },
			parse: "number",
			limited: true,
			optional: true,
		},
	];

	return mapTable(info, range, fields).filter(chapterFilter(info.chapterLimit, "chapter"));
}
