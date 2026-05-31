import { chapterFilter, mapTable } from "./shared";

export function getAchievements(info: SpreadsheetInfo) {
	const definition: Table<Achievement> = {
		range: info.ss.getSheetByName("Achievements")!.getDataRange(),
		fields: [
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
			{ key: "tier", source: { type: "exact", name: "Tier" }, parse: "string" },
			{ key: "description", source: { type: "exact", name: "Achievement" }, parse: "rich" },
			{ key: "message", source: { type: "exact", name: "Message" }, parse: "rich" },
			{ key: "messageRecipients", source: { type: "exact", name: "Message Recipients" }, parse: "split_string" },
			{ key: "rewards", source: { type: "exact", name: "Rewards" }, parse: "rich" },
			{ key: "note", source: { type: "exact", name: "Other Notes" }, parse: "rich" },
		],
	};
	return mapTable(info, definition).filter(chapterFilter(info.chapterLimit, "chapter"));
}
