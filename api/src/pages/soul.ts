import { chapterFilter, getEntireSheet, mapTable } from "../parser";

type InternalSupremacy = SupremacyStage & { supremacy: string };

export function getSoul(info: SpreadsheetInfo): SoulDetails {
	return {
		supremacies: getSupremacies(info),
	};
}

function getSupremacies(info: SpreadsheetInfo): Supremacies {
	const range = getEntireSheet(info, "Supremacies");
	const fields: Fields<InternalSupremacy> = [
		{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
		{ key: "stage", source: { type: "exact", name: "Stage" }, parse: "number" },
		{ key: "supremacy", source: { type: "exact", name: "Supremacy" }, parse: "string" },
		{ key: "bonus", source: { type: "exact", name: "Bonus" }, parse: "string" },
		{ key: "note", source: { type: "exact", name: "Note" }, parse: "rich" },
	];
	const data = mapTable(info, range, fields).filter(chapterFilter(info.chapterLimit, "chapter"));
	const grouped = {} as Supremacies;
	for (const row of data) {
		if (!grouped[row.supremacy]) grouped[row.supremacy] = [];
		grouped[row.supremacy].push({ ...row, supremacy: undefined } as SupremacyStage);
	}
	return grouped;
}

export function limitSoul(data: SoulDetails, info: LimiterInfo): SoulDetails {
	return {
		supremacies: limitSupremacies(data.supremacies, info),
	};
}

function limitSupremacies(data: Supremacies, info: LimiterInfo) {
	return Object.fromEntries(
		Object.entries(data)
			.map((x) => [x[0], x[1].filter(chapterFilter(info.chapterLimit, "chapter"))])
			.filter((x) => x[1].length > 0),
	);
}
