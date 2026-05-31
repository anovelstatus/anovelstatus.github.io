import { chapterFilter, getEntireSheet, mapTable } from "./shared";

export function getAchievements(info: SpreadsheetInfo) {
	const range = getEntireSheet(info, "Achievements");
	const fields: Fields<Achievement> = [
		{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
		{ key: "tier", source: { type: "exact", name: "Tier" }, parse: "string" },
		{ key: "description", source: { type: "exact", name: "Achievement" }, parse: "rich" },
		{ key: "message", source: { type: "exact", name: "Message" }, parse: "rich" },
		{ key: "messageRecipients", source: { type: "exact", name: "Message Recipients" }, parse: "split_string" },
		{ key: "rewards", source: { type: "exact", name: "Rewards" }, parse: "rich" },
		{ key: "note", source: { type: "exact", name: "Other Notes" }, parse: "rich" },
	];
	return mapTable(info, range, fields).filter(chapterFilter(info.chapterLimit, "chapter"));
}
