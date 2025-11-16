import { parseId } from "../shared";

type StatusColumns = Record<keyof BloodlineStatus, number>;
type BloodlineColumns = Omit<Record<keyof Bloodline, number>, "updates">;

export const getBloodlines: CacheableFunc<Bloodline[]> = (ss, ranges, attributes, chapterLimit) => {
	const updates = getBloodlineUpdates(ss, ranges, attributes, chapterLimit);

	const range = ranges.Bloodlines;
	const data = ss.getRange(range).getValues();
	const headers = mapBloodlineColumns(data[0]!);
	return data
		.slice(1)
		.map((row) => mapBloodlineRow(row, headers, updates))
		.filter((x) => x.updates.length > 0);
};

function mapBloodlineColumns(headerRow: string[]): BloodlineColumns {
	return {
		name: headerRow.indexOf("Bloodline"),
		title: headerRow.indexOf("Title"),
		lore: headerRow.indexOf("Lore"),
	};
}

function mapBloodlineRow(row: SpreadsheetValue[], headers: BloodlineColumns, updates: BloodlineStatus[]): Bloodline {
	const name = row[headers.name];
	return {
		name: name as string,
		title: parseId(row[headers.title] as string),
		lore: row[headers.lore] as string,
		updates: updates.filter((x) => name == x.name),
	};
}

export const getBloodlineUpdates: CacheableFunc<BloodlineStatus[]> = (ss, ranges, _attributes, chapterLimit) => {
	const range = ranges["Bloodline Updates"];
	const data = ss.getRange(range).getValues();
	const headers = mapStatusColumns(data[0]!);
	return data
		.slice(1)
		.map((row) => mapUpdateRow(row, headers))
		.filter((x) => x.chapter <= chapterLimit);
};

function mapStatusColumns(headerRow: string[]): StatusColumns {
	return {
		name: headerRow.indexOf("Race"),
		chapter: headerRow.indexOf("Chapter"),
		purity: headerRow.indexOf("Purity"),
		status: headerRow.indexOf("Status"),
		note: headerRow.indexOf("Cause"),
	};
}

function mapUpdateRow(row: SpreadsheetValue[], headers: StatusColumns): BloodlineStatus {
	return {
		name: row[headers.name] as string,
		chapter: row[headers.chapter] as number,
		purity: row[headers.purity] as string | number,
		status: row[headers.status] as string,
		note: row[headers.note] as string,
	};
}
