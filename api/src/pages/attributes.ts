import { chapterFilter, parseDynamicTable } from "./shared";

type InternalBoost = Attribute.Boost & { attribute: string };
type InternalEvolution = Attribute.Evolution & { attribute: string };
type InternalGain = Attribute.Gain & { attribute: string };
type InternalMilestone = Attribute.Milestone & { attribute: string };

export function getAttributes(info: SpreadsheetInfo) {
	const milestones = getMilestones(info);
	const evolutions = getEvolutions(info);
	const boosts = getBoosts(info);
	const gains = getGains(info);

	const definition: Table<Attribute.Details> = {
		range: info.ss.getRange(info.ranges.Attributes),
		fields: [
			{ key: "name", source: { type: "exact", name: "Name" }, parse: { type: "string" } },
			{ key: "abbreviation", source: { type: "exact", name: "Short" }, parse: { type: "string" } },
			{ key: "category", source: { type: "exact", name: "Category" }, parse: { type: "string" } },
			{ key: "categoryAbbreviation", source: { type: "exact", name: "CategoryShort" }, parse: { type: "string" } },
			{ key: "color", source: { type: "exact", name: "Color" }, parse: { type: "string" } },
			{ key: "note", source: { type: "exact", name: "Description" }, parse: { type: "rich" } },
			// These must process after name
			{
				key: "milestones",
				parse: { type: "custom", parse: ({ rowSoFar }) => filterAndMap(rowSoFar.name!, milestones) },
			},
			{
				key: "evolutions",
				parse: { type: "custom", parse: ({ rowSoFar }) => filterAndMap(rowSoFar.name!, evolutions) },
			},
			{
				key: "gains",
				parse: { type: "custom", parse: ({ rowSoFar }) => filterAndMap(rowSoFar.name!, gains) },
			},
			{
				key: "boosts",
				parse: { type: "custom", parse: ({ rowSoFar }) => filterAndMap(rowSoFar.name!, boosts) },
			},
		],
	};
	return parseDynamicTable(info, definition);
}

function filterAndMap<T>(attribute: string, data: (T & { attribute: string })[]): T[] {
	return data.filter((x) => x.attribute === attribute).map((x) => ({ ...x, attribute: undefined }));
}

function getBoosts(info: SpreadsheetInfo) {
	const definition: Table<InternalBoost> = {
		range: info.ss.getRange(info.ranges["Attribute Boosts"]),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: { type: "number" } },
			{ key: "attribute", source: { type: "exact", name: "Attribute" }, parse: { type: "string" } },
			{ key: "boost", source: { type: "contains", contains: "Gain" }, parse: { type: "number" } },
			{ key: "title", source: { type: "exact", name: "Title" }, parse: { type: "tiered_id" } },
			{ key: "note", source: { type: "exact", name: "Note" }, parse: { type: "rich" } },
		],
	};
	return parseDynamicTable(info, definition);
}

function getEvolutions(info: SpreadsheetInfo) {
	const definition: Table<InternalEvolution> = {
		range: info.ss.getRange(info.ranges["Attribute Evolutions"]),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: { type: "number" } },
			{ key: "attribute", source: { type: "exact", name: "Attribute" }, parse: { type: "string" } },
			{ key: "name", source: { type: "exact", name: "Evolution" }, parse: { type: "string" } },
			{ key: "note", source: { type: "exact", name: "Description" }, parse: { type: "rich" } },
		],
	};
	return parseDynamicTable(info, definition);
}

function getGains(info: SpreadsheetInfo) {
	const definition: Table<InternalGain> = {
		range: info.ss.getSheetByName("Stat Gains")!.getDataRange(),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: { type: "number" } },
			{ key: "attribute", source: { type: "exact", name: "Attribute" }, parse: { type: "string" } },
			{ key: "gain", source: { type: "exact", name: "Gain" }, parse: { type: "number" } },
			{ key: "note", source: { type: "exact", name: "How / Why" }, parse: { type: "rich" } },
		],
	};
	return parseDynamicTable(info, definition);
}

function getMilestones(info: SpreadsheetInfo) {
	const definition: Table<InternalMilestone> = {
		range: info.ss.getRange(info.ranges["Attribute Milestones"]),
		filter: (x) => !!x,
		fields: [
			{ key: "attribute", source: { type: "exact", name: "Attribute" }, parse: { type: "string" } },
			{ key: "milestone", source: { type: "exact", name: "Milestone" }, parse: { type: "number" } },
			{ key: "note", source: { type: "exact", name: "Description" }, parse: { type: "rich" } },
		],
	};
	return parseDynamicTable(info, definition);
}
