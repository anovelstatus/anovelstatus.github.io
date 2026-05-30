/** Parse a value that might be a single number or a comma-separated list of numbers into a number array */
export function getNumbersLessThanLimit(value: SpreadsheetValue, chapterLimit: number): number[] {
	return parseNumberArray(value).filter((x) => x <= chapterLimit);
}

export function parseNumberArray(value: SpreadsheetValue): number[] {
	if (typeof value === "number") return [value];
	if (typeof value === "string") return parseSplitString(value, ",").map((x) => parseInt(x));
	return [];
}

export function getNumberIfLessThanLimit(value: SpreadsheetValue, chapterLimit: number) {
	if (typeof value === "number" && value <= chapterLimit) return value;
	return undefined;
}

export function parseBoolean(value: SpreadsheetValue): boolean {
	if (typeof value === "number") throw new Error("expected boolean");
	// Convert empty string and undefined to false
	return value === true;
}

export function parseString(value: SpreadsheetValue): string {
	if (typeof value !== "string") throw new Error("expected string");
	return value;
}

export function parseOptionalString(value: SpreadsheetValue): string | undefined {
	if (!value) return undefined;
	return parseString(value);
}

export function parseSplitString(value: SpreadsheetValue, split: string): string[] {
	if (!value) return [];
	if (typeof value !== "string") throw new Error("expected string");
	return value.split(split).map((x) => x.trim());
}

export function parseNumber(value: SpreadsheetValue): number {
	if (typeof value !== "number") throw new Error("expected number");
	return value;
}

export function parseOptional<T extends SpreadsheetValue>(value: SpreadsheetValue): T | undefined {
	if (value === "") return undefined;
	if (value === false) return undefined;
	return value as T;
}

export function parseOptionalId(value: SpreadsheetValue): TieredId | undefined {
	if (!value) return undefined;
	return parseId(value);
}

export function parseIds(value: SpreadsheetValue): TieredId[] {
	return parseSplitString(value, ",").map(parseId);
}

/** Figure out column indexes for all attributes in given row of headers */
export function setAttributeColumns(
	headers: HasSomeAttributes,
	headerRow: SpreadsheetValue[],
	attributeNames: string[],
) {
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
		if (typeof row[headers[attribute]] === "number") item[attribute] = parseNumber(row[headers[attribute]]);
	}
	return item;
}

/** Parse something like `Name - Tier` into a name and tier */
export function parseId(fullName: SpreadsheetValue): TieredId {
	fullName = parseString(fullName);
	const parts = fullName.split(" - ");
	// Get the last segment instead of assuming only 2 parts because at least one Talent has a dash in its name
	const tier = parts.pop()!;
	const name = parts.join(" - ");
	return { name, tier };
}

/** Get all text formatting details from a cell value */
export function parseRichText(value: RichValue | undefined): RichText[] {
	if (!value) return [];
	return value.getRuns().map((run) => {
		const style = run.getTextStyle();
		const obj: RichText = { t: run.getText() };

		const color = style.getForegroundColor();
		const bold = style.isBold();
		const italic = style.isItalic();
		const strikethrough = style.isStrikethrough();
		const underline = style.isUnderline();

		if (color && color !== "#000000" && color !== "#FFFFFF" && color !== "#ffffff") obj.c = color;
		if (bold) obj.b = bold;
		if (italic) obj.i = italic;
		if (strikethrough) obj.s = strikethrough;
		if (underline) obj.u = underline;

		return obj;
	});
}

// todo: better types to remove unknown
export function hasEntriesFilter<T>(key: keyof T): (entry: T) => boolean {
	return (entry: T) => (entry[key] as unknown as []).length > 0;
}

// todo: better types to remove unknown
export function chapterFilter<T>(chapterLimit: number, key: keyof T): (entry: T) => boolean {
	return (entry: T) => (entry[key] as unknown as number) <= chapterLimit;
}

/** Parse a table of plain text into an array of objects */
export function parseTable<T, TColumns, TExtra = never>(
	range: Range,
	mapColumns: (headerRow: SpreadsheetValue[], extra: TExtra) => TColumns,
	mapRow: (row: SpreadsheetValue[], headers: TColumns, extra: TExtra) => T,
	filter: (item: T) => boolean,
	extra?: TExtra,
): T[] {
	const values = range.getValues();
	const headers = mapColumns(values[0]!, extra!);
	return values
		.slice(1)
		.filter((row) => row[0] || row[0] === 0) // Skip rows with empty first cell
		.map((row) => mapRow(row, headers, extra!))
		.filter(filter);
}

/** Parse a table that might contain formatted text into an array of objects */
export function parseFormattedTable<T, TColumns, TExtra = never>(
	range: Range,
	mapColumns: (headerRow: SpreadsheetValue[], extra: TExtra) => TColumns,
	mapRow: (row: SpreadsheetValue[], richRow: RichValue[], headers: TColumns, extra: TExtra) => T,
	filter: (item: T) => boolean,
	extra?: TExtra,
): T[] {
	const values = range.getValues();
	const richValues = range.getRichTextValues();
	const headers = mapColumns(values[0]!, extra!);

	const data = [];
	for (let i = 1; i < values.length; i++) {
		// Make sure there's data in the row.
		// Don't just check the first cell because some have Chapter 0 entries that would be skipped.
		if (!values[i]![0] && !values[i]![1]) continue;
		const entry = mapRow(values[i]!, richValues[i]!, headers, extra!);
		if (filter(entry)) {
			data.push(entry);
		}
	}
	return data;
}

export function parseDynamicTable<T>(info: SpreadsheetInfo, definition: Table<T>) {
	const range = definition.getRange(info);

	const values = range.getValues();
	const hasRichValues = definition.fields.some((x) => x.parse.type === "rich");
	const richValues = hasRichValues ? range.getRichTextValues() : [[]];

	const headers = mapDynamicColumns(values[0]!, definition);

	if (!definition.filter) definition.filter = (_) => true;

	const data: T[] = [];
	for (let i = 1; i < values.length; i++) {
		// Make sure there's data in the row.
		// Don't just check the first cell because some have Chapter 0 entries that would be skipped.
		if (!values[i]![0] && !values[i]![1]) continue;
		const entry = mapDynamicRow(values[i]!, richValues[hasRichValues ? i : 0], headers, info, definition);
		if (definition.filter(entry)) {
			data.push(entry);
		}
	}
	return data;
}

function mapDynamicColumns<T, TExtra>(headers: string[], definition: Table<T, TExtra>) {
	const { fields } = definition;
	const columns = {} as Record<string, number>;
	for (const { key, source } of fields) {
		switch (source.type) {
			case "column":
				columns[key] = headers.indexOf(source.name);
				break;
			case "column-contains":
				columns[key] = headers.findIndex((x) => parseString(x).includes(source.contains));
				break;
			// todo: other field types
			default:
				throw new Error(`Invalid source for '${key}': ${source}`);
				break;
		}
	}
	return columns;
}

function mapDynamicRow<T, TExtra>(
	values: SpreadsheetValue[],
	richValues: RichValue[],
	headers: Record<string, number>,
	info: SpreadsheetInfo,
	definition: Table<T, TExtra>,
) {
	const { fields } = definition;
	const item: Record<string, unknown> = {};

	for (const { key, parse } of fields) {
		const value = headers[key] ? values[headers[key]] : undefined;
		switch (parse.type) {
			case "rich":
				item[key] = parseRichText(richValues[headers[key]]);
				break;
			case "number":
				item[key] = parse.limited ? getNumberIfLessThanLimit(value, info.chapterLimit) : parseNumber(value);
				break;
			case "string":
				item[key] = parse.optional ? parseOptionalString(value) : parseString(value);
				break;
			case "tiered_id":
				item[key] = parseId(value);
				break;
			// todo: other field types
			default:
				throw new Error(`Invalid parse for '${key}': ${parse}`);
				break;
		}
	}
	return item as T;
}
