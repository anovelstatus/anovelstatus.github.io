import { chapterFilter, getEntireSheet, mapTable } from "../parser";

type InternalSupremacy = SupremacyStage & { supremacy: string };

export function getSoul(info: SpreadsheetInfo): SoulDetails {
	return {
		supremacies: getSupremacies(info),
		highTribulations: getHighTribulations(info),
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
	const data = mapTable(info, range, fields);
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
		highTribulations: limitTribulations(data.highTribulations, info),
	};
}

function limitSupremacies(data: Supremacies, info: LimiterInfo) {
	// Go back to object from leftover array
	return Object.fromEntries(
		// Convert map to array
		Object.entries(data)
			// remove future stages
			.map((x) => [x[0], x[1].filter(chapterFilter(info.chapterLimit, "chapter"))])
			// then remove any supremacy without any stages
			.filter((x) => x[1].length > 0),
	);
}

function getHighTribulations(info: SpreadsheetInfo) {
	const range = getEntireSheet(info, "High Tribulations");
	const fields: Fields<HighTribulationUpdate> = [
		{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
		{ key: "tier", source: { type: "exact", name: "Tier" }, parse: "number" },
		{ key: "note", source: { type: "exact", name: "Update" }, parse: "rich" },
		{ key: "done", source: { type: "exact", name: "Pass" }, parse: "string" },
	];
	const data = mapTable(info, range, fields);
	return data;
}

function limitTribulations(data: HighTribulationUpdate[], info: LimiterInfo) {
	return data.filter(chapterFilter(info.chapterLimit, "chapter"));
}
