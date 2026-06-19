import { mapTable } from "./shared";

export function getOfficialStatuses(info: SpreadsheetInfo): OfficialStatus[] {
	// Not using entire sheet because this sheet still has all the calculated numbers
	const sheet = info.ss.getSheetByName("Statuses")!;
	const numberOfRows = sheet.getLastRow();
	const range = sheet.getRange(2, 1, numberOfRows - 1, info.attributes.length + 1);

	const fields: Fields<OfficialStatus> = [
		{ key: "note", source: { type: "exact", name: "Chapter" }, parse: "note" },
		{ key: "attributes", parse: "attributes" },
	];

	return mapTable(info, range, fields)
		.slice(0, info.chapterLimit)
		.map((status) => {
			if (status.attributes?.every((a) => a === 0)) status.attributes = undefined;
			return status;
		});
}
