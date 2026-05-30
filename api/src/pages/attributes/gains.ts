import { chapterFilter, parseDynamicTable } from "../shared";

export type InternalGain = Attribute.Gain & { attribute: string };

export function getGains(info: SpreadsheetInfo) {
	const definition: Table<InternalGain> = {
		range: info.ss.getSheetByName("Stat Gains")!.getDataRange(),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: { type: "number" } },
			{ key: "attribute", source: { type: "exact", name: "Attribute" }, parse: { type: "string" } },
			{ key: "gain", source: { type: "exact", name: "Gain" }, parse: { type: "number" } },
			{ key: "note", source: { type: "exact", name: "How / Why" }, parse: { type: "rich" } },
		],
	};
	return parseDynamicTable(info, definition);
}
