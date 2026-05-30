import { parseTable } from "./shared";

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
		tier: row[headers.tier] as number,
		skillName: row[headers.skillName] as string,
		metalName: row[headers.metalName] as string,
		chapterRevealed: row[headers.chapterRevealed] as number,
		fgColor: row[headers.fgColor] as string,
		bgColor: row[headers.bgColor] as string,
	};
	if (data.chapterRevealed > chapterLimit) {
		data.metalName = "?";
		data.skillName = "?";
	}
	return data;
}
