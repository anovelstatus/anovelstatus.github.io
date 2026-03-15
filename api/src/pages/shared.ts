/** Parse a value that might be a single number or a comma-separated list of numbers into a number array */
export function getNumbersLessThanLimit(value: SpreadsheetValue, chapterLimit: number): number[] {
	const chapters = parseNumberArray(value);
	return chapters.filter((x) => x <= chapterLimit);
}
export function parseNumberArray(value: SpreadsheetValue): number[] {
	if (typeof value === "number") return [value];
	if (typeof value === "string") return value.split(",").map((x) => parseInt(x));
	return [];
}

export function getNumberIfLessThanLimit(value: SpreadsheetValue, chapterLimit: number) {
	if (typeof value === "number" && value < chapterLimit) return value;
	return undefined;
}

/** Figure out column indexes for all attributes in given row of headers */
export function setAttributeColumns(headers: HasSomeAttributes, headerRow: string[], attributeNames: string[]) {
	for (const attribute of attributeNames) headers[attribute] = headerRow.indexOf(attribute);
	return headers;
}

/** Set values for all attributes on given item, based on row of data and headers */
export function setAttributeValues(
	item: HasSomeAttributes,
	row: SpreadsheetValue[],
	headers: HasSomeAttributes,
	attributeNames: string[],
) {
	for (const attribute of attributeNames) {
		if (typeof row[headers[attribute]!] === "number") item[attribute] = row[headers[attribute]!] as number;
	}
	return item;
}

/** Parse something like `Name - Tier` into a name and tier */
export function parseId(fullName: string): TieredId {
	const parts = fullName.split(" - ");
	// Get the last segment instead of assuming only 2 parts because at least one Talent has a dash in its name
	const tier = parts.pop() as string;
	const name = parts.join(" - ");
	return { name, tier };
}

/** Get all text formatting details from a cell value */
export function parseRichText(value: RichValue | undefined): RichText[] {
	if (!value) return [];
	return value.getRuns().map((run) => {
		const style = run.getTextStyle();
		return {
			text: run.getText(),
			fgColor: style.getForegroundColor() ?? "#000000",
			bold: style.isBold() ?? false,
			italic: style.isItalic() ?? false,
			strikethrough: style.isStrikethrough() ?? false,
			underline: style.isUnderline() ?? false,
		};
	});
}

export function getChapterFilter<T>(chapterLimit: number, key: keyof T): (entry: T) => boolean {
	return (entry: T) => (entry[key] as unknown as number) <= chapterLimit;
}

/** Parse a table of plain text into an array of objects */
export function parseTable<T, TColumns>(
	range: GoogleAppsScript.Spreadsheet.Range,
	mapColumns: (headerRow: SpreadsheetValue[]) => TColumns,
	mapRow: (row: SpreadsheetValue[], headers: TColumns) => T,
	filter: (item: T) => boolean,
): T[] {
	const values = range.getValues();
	const headers = mapColumns(values[0]!);
	return values
		.slice(1)
		.map((row) => mapRow(row, headers))
		.filter(filter);
}

/** Parse a table that might contain formatted text into an array of objects */
export function parseFormattedTable<T, TColumns>(
	range: GoogleAppsScript.Spreadsheet.Range,
	mapColumns: (headerRow: SpreadsheetValue[]) => TColumns,
	mapRow: (row: SpreadsheetValue[], richRow: RichValue[], headers: TColumns) => T,
	filter: (item: T) => boolean,
): T[] {
	const values = range.getValues();
	const richValues = range.getRichTextValues();
	const headers = mapColumns(values[0]!);

	const data = [];
	for (let i = 1; i < values.length; i++) {
		if (!values[i]![0]) continue;
		const entry = mapRow(values[i]!, richValues[i]!, headers);
		if (filter(entry)) {
			data.push(entry);
		}
	}
	return data;
}
