import { mapTable } from "./shared";

type InternalStatus = Status & Record<string, number>;

export function getOfficialStatuses(info: SpreadsheetInfo) {
	// Not using entire sheet because this sheet still has all the calculated numbers
	const sheet = info.ss.getSheetByName("Statuses")!;
	const numberOfRows = sheet.getLastRow();
	const range = sheet.getRange(2, 1, numberOfRows - 1, info.attributes.length + 1);

	const fields: Fields<InternalStatus> = [
		{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
		{ key: "note", source: { type: "exact", name: "Chapter" }, parse: "note" },
	];

	for (const attribute of info.attributes) {
		fields.push({
			key: attribute.name,
			source: { type: "exact", name: attribute.name },
			parse: "number",
			temporary: true,
			optional: true,
		});
	}
	fields.push({
		key: "attributes",
		// Need to figure out how to get the generics working properly
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		parse: ({ temp }) => info.attributes.map((x) => temp[x.name] || 0) as any,
	});

	return mapTable(info, range, fields).filter((x) => x.chapter <= info.chapterLimit && x[info.attributes[0].name] > 0);
}
