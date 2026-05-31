import { mapTable } from "./shared";

export function getOfficialStatuses(info: SpreadsheetInfo) {
	// Not using entire sheet because this sheet still has all the calculated numbers
	const sheet = info.ss.getSheetByName("Statuses")!;
	const numberOfRows = sheet.getLastRow();
	const range = sheet.getRange(2, 1, numberOfRows - 1, info.attributeNames.length + 1);

	const fields: Fields<Status> = [{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" }];

	for (const attribute of info.attributeNames) {
		fields.push({
			key: attribute,
			source: { type: "exact", name: attribute },
			parse: "number",
			optional: true,
		});
	}

	return mapTable(info, range, fields).filter((x) => x.chapter <= info.chapterLimit && x[info.attributeNames[0]!]! > 0);
}
