export function getEntireSheet(info: SpreadsheetInfo, sheetName: string): Range {
	return info.ss.getSheetByName(sheetName)!.getDataRange();
}

export function getRangeData(range: Range, getRichValues: boolean, getNotes: boolean): RangeData {
	const values = range.getValues();
	const richValues = getRichValues ? range.getRichTextValues() : [[]];
	const notes = getNotes ? range.getNotes() : [[]];

	return { values, richValues, notes };
}

/** Parse a value that might be a single number or a comma-separated list of numbers into a number array */
function parseNumbersLessThanLimit(value: SpreadsheetValue, chapterLimit: number): number[] {
	return parseNumbers(value).filter((x) => x <= chapterLimit);
}

function parseNumbers(value: SpreadsheetValue): number[] {
	if (typeof value === "number") return [value];
	if (typeof value === "string") return parseSplitString(value).map((x) => parseInt(x));
	return [];
}

function parseOptionalNumberLessThanLimit(value: SpreadsheetValue, chapterLimit: number) {
	if (typeof value === "number" && value <= chapterLimit) return value;
	return undefined;
}

function parseBoolean(value: SpreadsheetValue): boolean {
	if (typeof value === "number") throw new Error("expected boolean");
	// Convert empty string and undefined to false
	return value === true;
}

function parseOptionalBoolean(value: SpreadsheetValue): boolean | undefined {
	if (value === "") return undefined;
	if (value === false) return undefined;
	return parseBoolean(value);
}

export function parseString(value: SpreadsheetValue): string {
	if (typeof value !== "string") throw new Error("expected string");
	return value.trim();
}

function parseOptionalString(value: SpreadsheetValue): string | undefined {
	if (!value) return undefined;
	return parseString(value);
}

function parseSplitString(value: SpreadsheetValue): string[] {
	if (!value) return [];
	if (typeof value !== "string") throw new Error("expected string");
	return value.split(",").map((x) => x.trim());
}

export function parseNumber(value: SpreadsheetValue): number {
	if (typeof value !== "number") throw new Error("expected number");
	return value;
}

function parseOptionalNumber(value: SpreadsheetValue): number | undefined {
	if (value === "") return undefined;
	return parseNumber(value);
}

/** Parse something like `Name - Tier` into a name and tier */
export function parseId(fullName: SpreadsheetValue): TieredId {
	fullName = parseString(fullName);
	const parts = fullName.split(" - ").map((x) => x.trim());
	// Get the last segment instead of assuming only 2 parts because at least one Talent has a dash in its name
	const tier = parts.pop()!;
	const name = parts.join(" - ");
	return { name, tier };
}

/** Get all text formatting details from a cell value */
function parseRichText(value: RichValue): RichTextSpans {
	if (!value) return [];
	const spans = value
		.getRuns()
		.map((run) => {
			const style = run.getTextStyle();
			const obj: RichText = { t: run.getText() };

			const color = style.getForegroundColor();
			const bold = style.isBold();
			const italic = style.isItalic();
			const strikethrough = style.isStrikethrough();
			const underline = style.isUnderline();

			// Only set non-default values, to keep the data smaller
			if (color && color !== "#000000" && color !== "#FFFFFF" && color !== "#ffffff") obj.c = color;
			if (bold) obj.b = bold;
			if (italic) obj.i = italic;
			if (strikethrough) obj.s = strikethrough;
			if (underline) obj.u = underline;

			return obj;
		})
		// Skip outputting `[{"t":""}]`
		.filter((x) => x.t);
	if (!spans.length) return;
	return spans;
}

// todo: better types to remove unknown
export function chapterFilter<T>(chapterLimit: number, key: keyof T): (entry: T) => boolean {
	return (entry: T) => (entry[key] as unknown as number) <= chapterLimit;
}

/** Map a table from a sheet that has multiple tables on it */
export function mapTableInPage<T>(info: SpreadsheetInfo, rangeData: RangeData, fields: Fields<T>) {
	const hasRichValues = needsRichText(fields);
	const usesNotes = needsNotes(fields);
	const { values, richValues, notes } = rangeData;

	const { columns, start, end } = findTable(values, fields, info.attributes);

	const data: T[] = [];
	for (let i = start + 1; i < end; i++) {
		if (rowHasNoData(values[i])) continue;
		data.push(
			mapRow(
				values[i],
				richValues[hasRichValues ? i : 0],
				notes[usesNotes ? i : 0],
				columns,
				info.chapterLimit,
				fields,
				info.attributes,
			),
		);
	}
	return data;
}

function findTable<T>(values: SpreadsheetValue[][], fields: Fields<T>, attributes: Attribute.Details[]) {
	for (let i = 0; i < values.length; i++) {
		const row = values[i];
		const columns = findColumns(row, fields, attributes);
		if (Object.values(columns).some((x) => x === -1)) continue;
		for (let j = i; j < values.length; j++) {
			if (rowHasNoData(values[j])) return { columns, start: i, end: j };
		}
		return { columns, start: i, end: values.length };
	}
	throw new Error("Expected headers not found in range");
}

/** Map a table that occupies the entire given range */
export function mapTable<T>(info: SpreadsheetInfo, range: Range, fields: Fields<T>, skipRows: number = 0) {
	const hasRichValues = needsRichText(fields);
	const usesNotes = needsNotes(fields);
	const { values, richValues, notes } = getRangeData(range, hasRichValues, usesNotes);

	const headers = findColumns(values[skipRows], fields, info.attributes);

	const data: T[] = [];
	for (let i = skipRows + 1; i < values.length; i++) {
		if (rowHasNoData(values[i])) continue;
		data.push(
			mapRow(
				values[i],
				richValues[hasRichValues ? i : 0],
				notes[usesNotes ? i : 0],
				headers,
				info.chapterLimit,
				fields,
				info.attributes,
			),
		);
	}
	return data;
}

function rowHasNoData(row: SpreadsheetValue[]) {
	// Don't just check the first cell because some have Chapter 0 entries that would be skipped.
	return !row[0] && !row[1];
}

function needsRichText<T>(fields: Fields<T>) {
	return fields.some((x) => x.parse === "rich");
}

function needsNotes<T>(fields: Fields<T>) {
	return fields.some((x) => x.parse === "note");
}

function findColumns<T>(headers: SpreadsheetValue[], fields: Fields<T>, attributes: Attribute.Details[]) {
	const columns = {} as Record<string, number>;
	for (const { key, source } of fields) {
		if (!source) continue;
		switch (source.type) {
			case "exact":
				columns[key] = headers.indexOf(source.name);
				break;
			case "contains":
				columns[key] = headers.findIndex((x) => parseString(x).includes(source.contains));
				break;
			default:
				throw new Error(`Invalid source for '${key}': ${source}`);
		}
	}
	// If any field is the attribute array, then look for each one in the headers
	if (fields.some((x) => x.parse === "attributes")) {
		for (const attribute of attributes) {
			columns[attribute.name] = headers.indexOf(attribute.name);
		}
	}
	return columns;
}

function mapRow<T>(
	values: SpreadsheetValue[],
	richValues: RichValue[],
	notes: string[],
	headers: Record<string, number>,
	chapterLimit: number,
	fields: Fields<T>,
	attributes: Attribute.Details[],
) {
	const item: Record<string, unknown> = {};

	for (const field of fields) {
		const { key, parse, limited, optional } = field;
		const value = headers[key] !== undefined ? values[headers[key]] : undefined;
		try {
			switch (parse) {
				case "attributes":
					item[key] = attributes.map((attr) => parseOptionalNumber(values[headers[attr.name]]) || 0);
					break;
				case "rich":
					item[key] = parseRichText(richValues[headers[key]]);
					break;
				case "note":
					item[key] = notes[headers[key]];
					break;
				case "number":
					item[key] = limited
						? parseOptionalNumberLessThanLimit(value, chapterLimit)
						: optional
							? parseOptionalNumber(value)
							: parseNumber(value);
					break;
				case "string":
					item[key] = optional ? parseOptionalString(value) : parseString(value);
					break;
				case "bool":
					item[key] = optional ? parseOptionalBoolean(value) : parseBoolean(value);
					break;
				case "tiered_id": {
					const id = optional && !value ? undefined : parseId(value);
					if (id && key === "name|tier") {
						item.name = id.name;
						item.tier = id.tier;
					} else item[key] = id;
					break;
				}
				case "split_tiered_id":
					item[key] = parseSplitString(value).map(parseId);
					break;
				case "split_string":
					item[key] = parseSplitString(value);
					break;
				case "split_number":
					item[key] = limited ? parseNumbersLessThanLimit(value, chapterLimit) : parseNumbers(value);
					break;
				case "string_number":
					item[key] = value as string | number; // no great, but only used by one column
					break;
				default:
					if (typeof parse === "function") item[key] = parse({ rowSoFar: item as Partial<T>, value });
					else throw new Error(`Invalid parse for '${key}': ${parse}`);
					break;
			}
		} catch (e) {
			throw new Error(`Invalid parse for value '${value}': ${JSON.stringify(field)}`);
		}
	}
	return item as T;
}
