import { parseFormattedTable, parseRichText } from "../shared";

export type InternalMilestone = Attribute.Milestone & { attribute: string };
type Columns = Record<keyof InternalMilestone, number>;

export const getMilestones: CacheableFunc<InternalMilestone[]> = (ss, ranges) => {
	const range = ss.getRange(ranges["Attribute Milestones"]);
	return parseFormattedTable(range, mapColumns, mapRow, (x) => !!x);
};

function mapColumns(headerRow: SpreadsheetValue[]): Columns {
	return {
		attribute: headerRow.indexOf("Attribute"),
		milestone: headerRow.indexOf("Milestone"),
		note: headerRow.indexOf("Description"),
	};
}

function mapRow(row: SpreadsheetValue[], richRow: RichValue[], headers: Columns): InternalMilestone {
	return {
		attribute: row[headers.attribute] as string,
		note: parseRichText(richRow[headers.note]),
		milestone: row[headers.milestone] as number,
	};
}
