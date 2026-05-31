import { chapterFilter, getEntireSheet, mapTable } from "./shared";

export function getLore(info: SpreadsheetInfo) {
	const filter = chapterFilter(info.chapterLimit, "chapter");

	const fields: Fields<LoreEntry> = [
		{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
		{ key: "key", source: { type: "exact", name: "Key" }, parse: "string" },
		{ key: "note", source: { type: "exact", name: "Text" }, parse: "rich" },
	];

	const descRange = getEntireSheet(info, "Lore");
	const descriptions = mapTable(info, descRange, fields).filter(filter);

	const updateRange = getEntireSheet(info, "Updates");
	const updates = mapTable(info, updateRange, fields).filter(filter);

	return { descriptions, updates };
}
