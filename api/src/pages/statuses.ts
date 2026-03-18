import { parseTable, setAttributeColumns, setAttributeValues } from "./shared";

type Columns = Record<keyof Status, number>;

export const getOfficialStatuses: CacheableFunc<Status[]> = (ss, _ranges, attributeNames, chapterLimit) => {
	const sheet = ss.getSheetByName("Statuses")!;
	const numberOfRows = sheet.getDataRange().getNumRows();
	const range = sheet.getRange(2, 1, numberOfRows - 1, attributeNames.length + 1);

	return parseTable(
		range,
		(headerRow) => mapColumns(headerRow, attributeNames),
		(row, headers) => mapRow(row, headers, attributeNames),
		// Don't just filter on chapter. Make sure there's actually data in the row.
		(x) => x.chapter <= chapterLimit && x[attributeNames[0]!]! > 0,
	);
};

function mapColumns(headerRow: SpreadsheetValue[], attributeNames: string[]): Columns {
	const headers: Columns = {
		chapter: headerRow.indexOf("Chapter"),
	};
	return setAttributeColumns(headers, headerRow, attributeNames) as Columns;
}

function mapRow(row: SpreadsheetValue[], headers: Columns, attributeNames: string[]): Status {
	const status: Status = {
		chapter: row[headers["chapter"]!] as number,
	};
	return setAttributeValues(status, row, headers, attributeNames) as Status;
}
