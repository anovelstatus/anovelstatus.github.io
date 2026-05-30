import { parseNumber, parseTable, setAttributeColumns, setAttributeValues } from "./shared";

type Columns = Record<keyof Status, number>;

export const getOfficialStatuses: StandardParser<Status[]> = ({ ss, attributeNames, chapterLimit }) => {
	const sheet = ss.getSheetByName("Statuses")!;
	// Not using getDataRange because this sheet still has all the calculated numbers
	const numberOfRows = sheet.getLastRow();
	const range = sheet.getRange(2, 1, numberOfRows - 1, attributeNames.length + 1);

	// Don't just filter on chapter. Make sure there's actually data in the row.
	const filter = (x: Status): boolean => x.chapter <= chapterLimit && x[attributeNames[0]!]! > 0;

	return parseTable(range, mapColumns, mapRow, filter, attributeNames);
};

function mapColumns(headerRow: SpreadsheetValue[], attributeNames: string[]): Columns {
	const headers: Columns = {
		chapter: headerRow.indexOf("Chapter"),
	};
	return setAttributeColumns(headers, headerRow, attributeNames) as Columns;
}

function mapRow(row: SpreadsheetValue[], headers: Columns, attributeNames: string[]): Status {
	const status: Status = {
		chapter: parseNumber(row[headers.chapter]),
	};
	return setAttributeValues(status, row, headers, attributeNames) as Status;
}
