import { chapterFilter, parseDynamicTable, parseId } from "./shared";

type InternalTitle = Omit<Title, keyof TieredId> & { title: string };

/** Get list of Titles and their metadata. This does NOT include metadata for attribute boosts. That is loaded separately. */
export function getTitles(info: SpreadsheetInfo) {
	const definition: Table<InternalTitle> = {
		getRange: ({ ss, ranges }) => ss.getRange(ranges.Titles),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "title", source: { type: "exact", name: "Title" }, parse: { type: "string" } },
			{ key: "note", source: { type: "exact", name: "Description" }, parse: { type: "rich" } },
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: { type: "number" } },
			{ key: "previous", source: { type: "exact", name: "Previous" }, parse: { type: "tiered_id", optional: true } },
			{
				key: "replaced",
				source: { type: "exact", name: "Chapter Replaced" },
				parse: { type: "number", limited: true, optional: true },
			},
		],
		extra: undefined,
	};

	return parseDynamicTable(info, definition).map((x): Title => {
		const id = parseId(x.title);
		return { ...id, note: x.note, chapter: x.chapter, previous: x.previous, replaced: x.replaced };
	});
}
