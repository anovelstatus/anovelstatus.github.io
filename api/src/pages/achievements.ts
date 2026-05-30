import { chapterFilter, parseDynamicTable } from "./shared";

export function getAchievements(info: SpreadsheetInfo) {
	const definition: Table<Achievement> = {
		range: info.ss.getSheetByName("Achievements")!.getDataRange(),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: { type: "number" } },
			{ key: "tier", source: { type: "exact", name: "Tier" }, parse: { type: "string" } },
			{ key: "description", source: { type: "exact", name: "Achievement" }, parse: { type: "rich" } },
			{ key: "message", source: { type: "exact", name: "Message" }, parse: { type: "rich" } },
			{
				key: "messageRecipients",
				source: { type: "exact", name: "Message Recipients" },
				parse: { type: "split_string" },
			},
			{ key: "rewards", source: { type: "exact", name: "Rewards" }, parse: { type: "rich" } },
			{ key: "note", source: { type: "exact", name: "Other Notes" }, parse: { type: "rich" } },
		],
		extra: undefined,
	};
	return parseDynamicTable(info, definition);
}
