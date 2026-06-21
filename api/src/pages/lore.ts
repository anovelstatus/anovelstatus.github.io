import { chapterFilter, getEntireSheet, mapTable } from "../parser";

export function getLore(info: SpreadsheetInfo): LoreEntry[] {
	const range = getEntireSheet(info, "Lore");

	const fields: Fields<LoreEntry> = [
		{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
		{ key: "key", source: { type: "exact", name: "Key" }, parse: "string" },
		{ key: "note", source: { type: "exact", name: "Text" }, parse: "rich" },
		{ key: "permanent", source: { type: "contains", contains: "Permanent" }, parse: "bool", optional: true },
	];

	return mapTable(info, range, fields).filter(chapterFilter(info.chapterLimit, "chapter"));
}
