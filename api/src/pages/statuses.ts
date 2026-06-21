import { mapTable } from "../parser";

export function getOfficialStatuses(info: SpreadsheetInfo): OfficialStatus[] {
	// Not using entire sheet because this sheet still has all the calculated numbers
	const sheet = info.ss.getSheetByName("Statuses")!;
	const numberOfRows = sheet.getLastRow();
	const range = sheet.getRange(2, 1, numberOfRows - 1, info.attributes.length + 1);

	const fields: Fields<OfficialStatus> = [
		{ key: "note", source: { type: "exact", name: "Chapter" }, parse: "note" },
		{ key: "attributes", parse: "attributes" },
	];

	return (
		mapTable(info, range, fields)
			// Assume the sheet is ordered by chapter
			.slice(0, info.chapterLimit)
			// Keep entry but save bytes on chapters missing an official status
			.map((status) => {
				if (status.attributes?.every((a) => a === 0)) status.attributes = undefined;
				return status;
			})
	);
}
