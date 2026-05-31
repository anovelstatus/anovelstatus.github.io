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
	return value;
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
	const parts = fullName.split(" - ");
	// Get the last segment instead of assuming only 2 parts because at least one Talent has a dash in its name
	const tier = parts.pop()!;
	const name = parts.join(" - ");
	return { name, tier };
}

/** Get all text formatting details from a cell value */
function parseRichText(value: RichValue): RichText[] {
	if (!value) return [];
	return value.getRuns().map((run) => {
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
	});
}

// todo: better types to remove unknown
export function chapterFilter<T>(chapterLimit: number, key: keyof T): (entry: T) => boolean {
	return (entry: T) => (entry[key] as unknown as number) <= chapterLimit;
}

export function mapTable<T>(info: SpreadsheetInfo, table: Table<T>) {
	const values = table.range.getValues();

	const hasRichValues = table.fields.some((x) => x.parse === "rich");
	const richValues = hasRichValues ? table.range.getRichTextValues() : [[]];

	const headers = findColumns(values[0], table);

	if (!table.filter) table.filter = (_) => true;

	const data: T[] = [];
	for (let i = 1; i < values.length; i++) {
		// Make sure there's data in the row.
		// Don't just check the first cell because some have Chapter 0 entries that would be skipped.
		if (!values[i]![0] && !values[i]![1]) continue;
		const entry = mapRow(values[i]!, richValues[hasRichValues ? i : 0], headers, info.chapterLimit, table);
		if (table.filter(entry)) {
			data.push(entry);
		}
	}
	return data;
}

function findColumns<T>(headers: SpreadsheetValue[], definition: Table<T>) {
	const { fields } = definition;
	const columns = {} as Record<keyof T, number>;
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
				break;
		}
	}
	return columns;
}

function mapRow<T>(
	values: SpreadsheetValue[],
	richValues: RichValue[],
	headers: Record<string, number>,
	chapterLimit: number,
	definition: Table<T>,
) {
	const { fields } = definition;
	const item: Record<string, unknown> = {};

	for (const field of fields) {
		const { key, parse, limited, optional } = field;
		const value = headers[key] !== undefined ? values[headers[key]] : undefined;
		try {
			switch (parse) {
				case "rich":
					item[key] = parseRichText(richValues[headers[key]]);
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
				case "tiered_id":
					item[key] = optional && !value ? undefined : parseId(value);
					break;
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
