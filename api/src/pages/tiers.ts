import { parseNumber, parseString, parseTable } from "./shared";

type Columns = Record<keyof TierInfo, number>;

export const getTiers: StandardParser<TierInfo[]> = ({ ss, chapterLimit }) => {
	const range = ss.getSheetByName("Tiers")!.getDataRange();
	return parseTable(range, mapColumns, mapRow, (_) => true, chapterLimit);
};

function mapColumns(headerRow: SpreadsheetValue[]): Columns {
	return {
		tier: headerRow.indexOf("Tier"),
		skillName: headerRow.indexOf("Skill"),
		metalName: headerRow.indexOf("Metal"),
		chapterRevealed: headerRow.indexOf("Chapter Revealed"),
		fgColor: headerRow.indexOf("Foreground"),
		bgColor: headerRow.indexOf("Background"),
	};
}

function mapRow(row: SpreadsheetValue[], headers: Columns, chapterLimit: number): TierInfo {
	const data: TierInfo = {
		tier: parseNumber(row[headers.tier]),
		skillName: parseString(row[headers.skillName]),
		metalName: parseString(row[headers.metalName]),
		chapterRevealed: parseNumber(row[headers.chapterRevealed]),
		fgColor: parseString(row[headers.fgColor]),
		bgColor: parseString(row[headers.bgColor]),
	};
	if (data.chapterRevealed > chapterLimit) {
		data.metalName = "?";
		data.skillName = "?";
	}
	return data;
}
