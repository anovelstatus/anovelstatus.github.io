import { chapterFilter, parseDynamicTable } from "../shared";

export type InternalGain = Attribute.Gain & { attribute: string };

export function getGains(info: SpreadsheetInfo) {
	const definition: Table<InternalGain> = {
		getRange: (info) => info.ss.getSheetByName("Stat Gains")!.getDataRange(),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "column", name: "Chapter" }, parse: { type: "number" } },
			{
				key: "attribute",
				source: { type: "column", name: "Attribute" },
				parse: { type: "string" },
			},
			{
				key: "gain",
				source: { type: "column", name: "Gain" },
				parse: { type: "number" },
			},
			{ key: "note", source: { type: "column", name: "How / Why" }, parse: { type: "rich" } },
		],
		extra: undefined,
	};
	return parseDynamicTable(info, definition);
}
