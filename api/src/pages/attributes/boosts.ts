import { chapterFilter, parseDynamicTable } from "../shared";

export type InternalBoost = Attribute.Boost & { attribute: string };

export function getBoosts(info: SpreadsheetInfo) {
	const definition: Table<InternalBoost> = {
		getRange: (info) => info.ss.getRange(info.ranges["Attribute Boosts"]),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "column", name: "Chapter" }, parse: { type: "number" } },
			{
				key: "attribute",
				source: { type: "column", name: "Attribute" },
				parse: { type: "string" },
			},
			{
				key: "boost",
				source: { type: "column-contains", contains: "Gain" },
				parse: { type: "number" },
			},
			{ key: "title", source: { type: "column", name: "Title" }, parse: { type: "tiered_id" } },
			{ key: "note", source: { type: "column", name: "Note" }, parse: { type: "rich" } },
		],
		extra: undefined,
	};
	return parseDynamicTable(info, definition);
}
