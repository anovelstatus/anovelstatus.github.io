type Columns = Record<keyof TierInfo, number>;

export const getTiers: CacheableFunc<TierInfo[]> = (ss, ranges, _attributes, chapterLimit) => {
	const data = ss.getRange(ranges["Tiers"]).getValues();
	const headers = mapColumns(data[0]!);

	const tiers = data
		.slice(1)
		.filter((x) => x[1])
		.map((row) => mapRow(row, headers));
	hideNames(tiers, chapterLimit);
	return tiers;
};

function hideNames(tiers: TierInfo[], chapterLimit: number) {
	for (const t of tiers) {
		if (!t.chapterRevealed || t.chapterRevealed > chapterLimit) {
			t.metalName = "?";
			t.skillName = "?";
		}
	}
}

function mapColumns(headerRow: string[]): Columns {
	return {
		tier: headerRow.indexOf("Tier"),
		skillName: headerRow.indexOf("Skill"),
		metalName: headerRow.indexOf("Metal"),
		chapterRevealed: headerRow.indexOf("Chapter Revealed"),
		fgColor: headerRow.indexOf("Foreground"),
		bgColor: headerRow.indexOf("Background"),
	};
}

function mapRow(row: SpreadsheetValue[], headers: Columns): TierInfo {
	return {
		tier: row[headers.tier] as number,
		skillName: row[headers.skillName] as string,
		metalName: row[headers.metalName] as string,
		chapterRevealed: row[headers.chapterRevealed] as number,
		fgColor: row[headers.fgColor] as string,
		bgColor: row[headers.bgColor] as string,
	};
}
