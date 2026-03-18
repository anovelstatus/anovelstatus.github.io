import { getChapterFilter, parseFormattedTable, parseId, parseRichText, parseTable } from "../shared";

type StatusColumns = Record<keyof BloodlineStatus, number>;
type BloodlineColumns = Omit<Record<keyof Bloodline, number>, "updates">;

export const getBloodlines: CacheableFunc<Bloodline[]> = (ss, ranges, attributes, chapterLimit) => {
	const updates = getBloodlineUpdates(ss, ranges, attributes, chapterLimit);
	return parseTable(
		ss.getRange(ranges.Bloodlines),
		mapBloodlineColumns,
		(row, headers) => mapBloodlineRow(row, headers, updates),
		(row) => row.updates.length > 0,
	);
};

function mapBloodlineColumns(headerRow: SpreadsheetValue[]): BloodlineColumns {
	return {
		name: headerRow.indexOf("Bloodline"),
		lore: headerRow.indexOf("Lore Key"),
		quality: headerRow.indexOf("Quality"),
	};
}

function mapBloodlineRow(row: SpreadsheetValue[], headers: BloodlineColumns, updates: BloodlineStatus[]): Bloodline {
	const name = row[headers.name];
	return {
		name: name as string,
		lore: row[headers.lore] as string,
		quality: row[headers.quality] as string,
		updates: updates.filter((x) => name == x.name),
	};
}

const getBloodlineUpdates: CacheableFunc<BloodlineStatus[]> = (ss, ranges, _attributes, chapterLimit) => {
	return parseFormattedTable(
		ss.getRange(ranges["Bloodline Updates"]),
		mapStatusColumns,
		mapStatusRow,
		getChapterFilter(chapterLimit, "chapter"),
	);
};

function mapStatusColumns(headerRow: SpreadsheetValue[]): StatusColumns {
	return {
		name: headerRow.indexOf("Race"),
		chapter: headerRow.indexOf("Chapter"),
		purity: headerRow.indexOf("Purity"),
		status: headerRow.indexOf("Status"),
		note: headerRow.indexOf("Cause"),
		title: headerRow.indexOf("Title"),
	};
}

function mapStatusRow(row: SpreadsheetValue[], richRow: RichValue[], headers: StatusColumns): BloodlineStatus {
	return {
		name: row[headers.name] as string,
		chapter: row[headers.chapter] as number,
		purity: row[headers.purity] as string | number,
		status: row[headers.status] as string,
		note: parseRichText(richRow[headers.note]!),
		title: row[headers.title] ? parseId(row[headers.title] as string) : undefined,
	};
}
