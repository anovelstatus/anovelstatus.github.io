import { setAttributeColumns, setAttributeValues } from "./shared";

type Columns = Record<keyof Status, number>;

export const getOfficialStatuses: CacheableFunc<Status[]> = (ss, _ranges, attributeNames, chapterLimit) => {
	const sheet = ss.getSheetByName("Statuses")!;
	const numberOfRows = sheet.getDataRange().getNumRows();
	const data = sheet.getRange(2, 1, numberOfRows - 1, attributeNames.length + 1).getValues();

	const headers = mapColumns(data[0]!, attributeNames);

	return (
		data
			.slice(1)
			.map((row) => mapRow(row, headers, attributeNames))
			// make sure the row isn't empty
			.filter((x) => x.chapter && x.chapter <= chapterLimit && x[attributeNames[0]!])
	);
};

function mapColumns(headerRow: string[], attributeNames: string[]): Columns {
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
