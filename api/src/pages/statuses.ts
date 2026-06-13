import { mapTable } from "./shared";

export function getOfficialStatuses(info: SpreadsheetInfo) {
	// Not using entire sheet because this sheet still has all the calculated numbers
	const sheet = info.ss.getSheetByName("Statuses")!;
	const numberOfRows = sheet.getLastRow();
	const range = sheet.getRange(2, 1, numberOfRows - 1, info.attributes.length + 1);

	const fields: Fields<Status> = [
		{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
		{ key: "note", source: { type: "exact", name: "Chapter" }, parse: "note" },
		{ key: "attributes", parse: "attributes" },
	];

	return mapTable(info, range, fields).filter((x) => x.chapter <= info.chapterLimit && x.attributes.some((x) => x > 0));
}
