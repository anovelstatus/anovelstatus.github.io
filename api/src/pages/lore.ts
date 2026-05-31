import { chapterFilter, mapTable } from "./shared";

export function getLore(info: SpreadsheetInfo) {
	const descDef: Table<LoreEntry> = {
		range: info.ss.getSheetByName("Lore")!.getDataRange(),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
			{ key: "key", source: { type: "exact", name: "Key" }, parse: "string" },
			{ key: "note", source: { type: "exact", name: "Text" }, parse: "rich" },
		],
	};
	const descriptions = mapTable(info, descDef);

	const updateDef: Table<LoreEntry> = {
		...descDef,
		range: info.ss.getSheetByName("Updates")!.getDataRange(),
	};
	const updates = mapTable(info, updateDef);

	return { descriptions, updates };
}
