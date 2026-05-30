import { chapterFilter, parseDynamicTable } from "../shared";

export type InternalBoost = Attribute.Boost & { attribute: string };

export function getBoosts(info: SpreadsheetInfo) {
	const definition: Table<InternalBoost> = {
		getRange: (info) => info.ss.getRange(info.ranges["Attribute Boosts"]),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: { type: "number" } },
			{
				key: "attribute",
				source: { type: "exact", name: "Attribute" },
				parse: { type: "string" },
			},
			{
				key: "boost",
				source: { type: "contains", contains: "Gain" },
				parse: { type: "number" },
			},
			{ key: "title", source: { type: "exact", name: "Title" }, parse: { type: "tiered_id" } },
			{ key: "note", source: { type: "exact", name: "Note" }, parse: { type: "rich" } },
		],
		extra: undefined,
	};
	return parseDynamicTable(info, definition);
}
