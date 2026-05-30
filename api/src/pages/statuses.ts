import { parseDynamicTable } from "./shared";

export function getOfficialStatuses(info: SpreadsheetInfo) {
	const definition: Table<Status> = {
		getRange: ({ ss, attributeNames }) => {
			const sheet = ss.getSheetByName("Statuses")!;
			// Not using getDataRange because this sheet still has all the calculated numbers
			const numberOfRows = sheet.getLastRow();
			return sheet.getRange(2, 1, numberOfRows - 1, attributeNames.length + 1);
		},
		filter: (x: Status): boolean => x.chapter <= info.chapterLimit && x[info.attributeNames[0]!]! > 0,
		fields: [{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: { type: "number" } }],
		extra: undefined,
	};
	for (const attribute of info.attributeNames) {
		definition.fields.push({
			key: attribute,
			source: { type: "exact", name: attribute },
			parse: { type: "number", optional: true },
		});
	}

	return parseDynamicTable(info, definition);
}
