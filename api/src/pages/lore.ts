import { chapterFilter, parseDynamicTable } from "./shared";

export function getLore(info: SpreadsheetInfo) {
	const descDef: Table<LoreEntry> = {
		getRange: (info) => info.ss.getSheetByName("Lore")!.getDataRange(),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "column", name: "Chapter" }, parse: { type: "number" } },
			{ key: "key", source: { type: "column", name: "Key" }, parse: { type: "string" } },
			{ key: "note", source: { type: "column", name: "Text" }, parse: { type: "rich" } },
		],
		extra: undefined,
	};
	const descriptions = parseDynamicTable(info, descDef);

	const updateDef: Table<LoreEntry> = {
		...descDef,
		getRange: (info) => info.ss.getSheetByName("Updates")!.getDataRange(),
	};
	const updates = parseDynamicTable(info, updateDef);

	return { descriptions, updates };
}
