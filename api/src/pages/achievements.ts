import { chapterFilter, parseDynamicTable } from "./shared";

export function getAchievements(info: SpreadsheetInfo) {
	const definition: Table<Achievement> = {
		getRange: (info) => info.ss.getSheetByName("Achievements")!.getDataRange(),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "column", name: "Chapter" }, parse: { type: "number" } },
			{ key: "tier", source: { type: "column", name: "Tier" }, parse: { type: "string" } },
			{ key: "description", source: { type: "column", name: "Achievement" }, parse: { type: "rich" } },
			{ key: "message", source: { type: "column", name: "Message" }, parse: { type: "rich" } },
			{
				key: "messageRecipients",
				source: { type: "column", name: "Message Recipients" },
				parse: { type: "split-string" },
			},
			{ key: "rewards", source: { type: "column", name: "Rewards" }, parse: { type: "rich" } },
			{ key: "note", source: { type: "column", name: "Other Notes" }, parse: { type: "rich" } },
		],
		extra: undefined,
	};
	return parseDynamicTable(info, definition);
}
