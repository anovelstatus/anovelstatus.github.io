import { mapTable } from "./shared";

export function getOfficialStatuses(info: SpreadsheetInfo) {
	const sheet = info.ss.getSheetByName("Statuses")!;
	// Not using getDataRange because this sheet still has all the calculated numbers
	const numberOfRows = sheet.getLastRow();
	const range = sheet.getRange(2, 1, numberOfRows - 1, info.attributeNames.length + 1);
	const definition: Table<Status> = {
		range,
		fields: [{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" }],
	};
	for (const attribute of info.attributeNames) {
		definition.fields.push({
			key: attribute,
			source: { type: "exact", name: attribute },
			parse: "number",
			optional: true,
		});
	}

	return mapTable(info, definition).filter((x) => x.chapter <= info.chapterLimit && x[info.attributeNames[0]!]! > 0);
}
