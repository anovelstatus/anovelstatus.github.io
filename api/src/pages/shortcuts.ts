import { chapterFilter, parseDynamicTable } from "./shared";

export function getTimelineShortcuts(info: SpreadsheetInfo) {
	const definition: Table<Shortcut> = {
		getRange: (info) => info.ss.getRange(info.ranges["Chapter Shortcuts"]),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "column", name: "Chapter" }, parse: { type: "number" } },
			{ key: "label", source: { type: "column", name: "Label" }, parse: { type: "string" } },
			{ key: "group", source: { type: "column", name: "Group" }, parse: { type: "string", optional: true } },
			{ key: "menu", source: { type: "column", name: "Menu" }, parse: { type: "string", optional: true } },
		],
		extra: undefined,
	};
	return parseDynamicTable(info, definition);
}
