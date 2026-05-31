import { chapterFilter, mapTable } from "./shared";

export function getLore(info: SpreadsheetInfo) {
	const filter = chapterFilter(info.chapterLimit, "chapter");
	const descDef: Table<LoreEntry> = {
		range: info.ss.getSheetByName("Lore")!.getDataRange(),
		fields: [
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
			{ key: "key", source: { type: "exact", name: "Key" }, parse: "string" },
			{ key: "note", source: { type: "exact", name: "Text" }, parse: "rich" },
		],
	};
	const descriptions = mapTable(info, descDef).filter(filter);

	const updateDef: Table<LoreEntry> = {
		...descDef,
		range: info.ss.getSheetByName("Updates")!.getDataRange(),
	};
	const updates = mapTable(info, updateDef).filter(filter);

	return { descriptions, updates };
}
