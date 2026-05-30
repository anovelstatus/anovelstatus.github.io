import {
	chapterFilter,
	parseDynamicTable,
	parseFormattedTable,
	parseId,
	parseNumber,
	parseRichText,
	parseString,
} from "../shared";

export type InternalBoost = Attribute.Boost & { attribute: string };
type Columns = Record<keyof InternalBoost, number>;

export function newGetBoosts(info: SpreadsheetInfo) {
	const definition: Table<InternalBoost> = {
		getRange: (info) => info.ss.getRange(info.ranges["Attribute Boosts"]),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "column", name: "Chapter" }, parse: { type: "number" } },
			{
				key: "attribute",
				source: { type: "column", name: "Attribute" },
				parse: { type: "string" },
			},
			{
				key: "boost",
				source: { type: "column-contains", contains: "Gain" },
				parse: { type: "number" },
			},
			{ key: "title", source: { type: "column", name: "Title" }, parse: { type: "tiered_id" } },
			{ key: "note", source: { type: "column", name: "Note" }, parse: { type: "rich" } },
		],
		extra: undefined,
	};
	return parseDynamicTable(info, definition);
}

export const getBoosts: StandardParser<InternalBoost[]> = ({ ss, ranges, chapterLimit }) => {
	const range = ss.getRange(ranges["Attribute Boosts"]);
	return parseFormattedTable(range, mapColumns, mapRow, chapterFilter(chapterLimit, "chapter"));
};

function mapColumns(headerRow: SpreadsheetValue[]): Columns {
	return {
		chapter: headerRow.indexOf("Chapter"),
		attribute: headerRow.indexOf("Attribute"),
		boost: headerRow.findIndex((x) => parseString(x).includes("Gain")),
		title: headerRow.indexOf("Title"),
		note: headerRow.indexOf("Note"),
	};
}

function mapRow(row: SpreadsheetValue[], richRow: RichValue[], headers: Columns): InternalBoost {
	return {
		chapter: parseNumber(row[headers.chapter]),
		attribute: parseString(row[headers.attribute]),
		boost: parseNumber(row[headers.boost]),
		title: parseId(row[headers.title]),
		note: parseRichText(richRow[headers.note]),
	};
}
