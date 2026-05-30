import { chapterFilter, parseDynamicTable } from "./shared";

export function getLore(info: SpreadsheetInfo) {
	const descDef: Table<LoreEntry> = {
		range: info.ss.getSheetByName("Lore")!.getDataRange(),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: { type: "number" } },
			{ key: "key", source: { type: "exact", name: "Key" }, parse: { type: "string" } },
			{ key: "note", source: { type: "exact", name: "Text" }, parse: { type: "rich" } },
		],
		extra: undefined,
	};
	const descriptions = parseDynamicTable(info, descDef);

	const updateDef: Table<LoreEntry> = {
		...descDef,
		range: info.ss.getSheetByName("Updates")!.getDataRange(),
	};
	const updates = parseDynamicTable(info, updateDef);

	return { descriptions, updates };
}
