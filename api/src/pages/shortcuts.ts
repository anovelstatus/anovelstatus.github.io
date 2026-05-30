import { chapterFilter, parseDynamicTable } from "./shared";

export function getTimelineShortcuts(info: SpreadsheetInfo) {
	const definition: Table<Shortcut> = {
		range: info.ss.getRange(info.ranges["Chapter Shortcuts"]),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: { type: "number" } },
			{ key: "label", source: { type: "exact", name: "Label" }, parse: { type: "string" } },
			{ key: "group", source: { type: "exact", name: "Group" }, parse: { type: "string", optional: true } },
			{ key: "menu", source: { type: "exact", name: "Menu" }, parse: { type: "string", optional: true } },
		],
	};
	return parseDynamicTable(info, definition);
}
