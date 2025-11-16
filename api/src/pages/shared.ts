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
