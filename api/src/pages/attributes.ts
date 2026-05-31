import { chapterFilter, mapTable } from "./shared";

type HasAttribute = { attribute: string };
type InternalBoost = Attribute.Boost & HasAttribute;
type InternalEvolution = Attribute.Evolution & HasAttribute;
type InternalGain = Attribute.Gain & HasAttribute;
type InternalMilestone = Attribute.Milestone & HasAttribute;

export function getAttributes(info: SpreadsheetInfo) {
	const milestones = getMilestones(info);
	const evolutions = getEvolutions(info);
	const boosts = getBoosts(info);
	const gains = getGains(info);

	const definition: Table<Attribute.Details> = {
		range: info.ss.getRange(info.ranges.Attributes),
		fields: [
			{ key: "name", source: { type: "exact", name: "Name" }, parse: "string" },
			{ key: "abbreviation", source: { type: "exact", name: "Short" }, parse: "string" },
			{ key: "category", source: { type: "exact", name: "Category" }, parse: "string" },
			{ key: "categoryAbbreviation", source: { type: "exact", name: "CategoryShort" }, parse: "string" },
			{ key: "color", source: { type: "exact", name: "Color" }, parse: "string" },
			{ key: "note", source: { type: "exact", name: "Description" }, parse: "rich" },
			// These must process after name
			{ key: "milestones", parse: ({ rowSoFar }) => filterAndMap(rowSoFar, milestones) },
			{ key: "evolutions", parse: ({ rowSoFar }) => filterAndMap(rowSoFar, evolutions) },
			{ key: "gains", parse: ({ rowSoFar }) => filterAndMap(rowSoFar, gains) },
			{ key: "boosts", parse: ({ rowSoFar }) => filterAndMap(rowSoFar, boosts) },
		],
	};
	return mapTable(info, definition);
}

function filterAndMap<T>(attribute: Partial<Attribute.Details>, data: (T & HasAttribute)[]): T[] {
	return data.filter((x) => x.attribute === attribute.name).map((x) => ({ ...x, attribute: undefined }));
}

function getBoosts(info: SpreadsheetInfo) {
	const definition: Table<InternalBoost> = {
		range: info.ss.getRange(info.ranges["Attribute Boosts"]),
		fields: [
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
			{ key: "attribute", source: { type: "exact", name: "Attribute" }, parse: "string" },
			{ key: "boost", source: { type: "contains", contains: "Gain" }, parse: "number" },
			{ key: "title", source: { type: "exact", name: "Title" }, parse: "tiered_id" },
			{ key: "note", source: { type: "exact", name: "Note" }, parse: "rich" },
		],
	};
	return mapTable(info, definition).filter(chapterFilter(info.chapterLimit, "chapter"));
}

function getEvolutions(info: SpreadsheetInfo) {
	const definition: Table<InternalEvolution> = {
		range: info.ss.getRange(info.ranges["Attribute Evolutions"]),
		fields: [
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
			{ key: "attribute", source: { type: "exact", name: "Attribute" }, parse: "string" },
			{ key: "name", source: { type: "exact", name: "Evolution" }, parse: "string" },
			{ key: "note", source: { type: "exact", name: "Description" }, parse: "rich" },
		],
	};
	return mapTable(info, definition).filter(chapterFilter(info.chapterLimit, "chapter"));
}

function getGains(info: SpreadsheetInfo) {
	const definition: Table<InternalGain> = {
		range: info.ss.getSheetByName("Stat Gains")!.getDataRange(),
		fields: [
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
			{ key: "attribute", source: { type: "exact", name: "Attribute" }, parse: "string" },
			{ key: "gain", source: { type: "exact", name: "Gain" }, parse: "number" },
			{ key: "note", source: { type: "exact", name: "How / Why" }, parse: "rich" },
		],
	};
	return mapTable(info, definition).filter(chapterFilter(info.chapterLimit, "chapter"));
}

function getMilestones(info: SpreadsheetInfo) {
	const definition: Table<InternalMilestone> = {
		range: info.ss.getRange(info.ranges["Attribute Milestones"]),
		fields: [
			{ key: "attribute", source: { type: "exact", name: "Attribute" }, parse: "string" },
			{ key: "milestone", source: { type: "exact", name: "Milestone" }, parse: "number" },
			{ key: "note", source: { type: "exact", name: "Description" }, parse: "rich" },
		],
	};
	return mapTable(info, definition).filter((x) => !!x);
}
