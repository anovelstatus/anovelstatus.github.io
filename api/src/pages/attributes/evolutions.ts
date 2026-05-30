import { chapterFilter, parseDynamicTable } from "../shared";

export type InternalEvolution = Attribute.Evolution & { attribute: string };

export function getEvolutions(info: SpreadsheetInfo) {
	const definition: Table<InternalEvolution> = {
		getRange: (info) => info.ss.getRange(info.ranges["Attribute Evolutions"]),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "column", name: "Chapter" }, parse: { type: "number" } },
			{
				key: "attribute",
				source: { type: "column", name: "Attribute" },
				parse: { type: "string" },
			},
			{
				key: "name",
				source: { type: "column", name: "Evolution" },
				parse: { type: "string" },
			},
			{ key: "note", source: { type: "column", name: "Description" }, parse: { type: "rich" } },
		],
		extra: undefined,
	};
	return parseDynamicTable(info, definition);
}
