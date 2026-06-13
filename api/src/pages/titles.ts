import { chapterFilter, getEntireSheet, mapTable, parseId } from "./shared";

type InternalTitle = Omit<Title, keyof TieredId> & { title: string };

/** Get list of Titles and their metadata. This does NOT include metadata for attribute boosts. That is loaded separately. */
export function getTitles(info: SpreadsheetInfo) {
	const range = getEntireSheet(info, "Titles");
	const fields: Fields<InternalTitle> = [
		{ key: "title", source: { type: "exact", name: "Title" }, parse: "string" },
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

	return mapTable(info, range, fields)
		.filter(chapterFilter(info.chapterLimit, "chapter"))
		.map((x): Title => {
			const id = parseId(x.title);
			return { ...id, note: x.note, chapter: x.chapter, previous: x.previous, replaced: x.replaced };
		});
}
