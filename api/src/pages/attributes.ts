import { chapterFilter, getEntireSheet, getRangeData, mapTable, mapTableInPage } from "./shared";

type HasAttribute = { attribute: string };
type InternalBoost = Attribute.Boost & HasAttribute;
type InternalEvolution = Attribute.Evolution & HasAttribute;
type InternalGain = Attribute.Gain & HasAttribute;
type InternalMilestone = Attribute.Milestone & HasAttribute;

export function getAttributes(info: SpreadsheetInfo): Attribute.Details[] {
	const range = getEntireSheet(info, "Attributes");
	const rangeData = getRangeData(range, true, false);

	const evoFields: Fields<InternalEvolution> = [
		{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
		{ key: "attribute", source: { type: "exact", name: "Attribute" }, parse: "string" },
		{ key: "name", source: { type: "exact", name: "Evolution" }, parse: "string" },
		{ key: "note", source: { type: "exact", name: "Description" }, parse: "rich" },
	];
	const evolutions = mapTableInPage(info, rangeData, evoFields);

	const milestoneFields: Fields<InternalMilestone> = [
		{ key: "attribute", source: { type: "exact", name: "Attribute" }, parse: "string" },
		{ key: "milestone", source: { type: "exact", name: "Milestone" }, parse: "number" },
		{ key: "note", source: { type: "exact", name: "Description" }, parse: "rich" },
	];
	const milestones = mapTableInPage(info, rangeData, milestoneFields);

	const boosts = getBoosts(info);
	const gains = getGains(info);

	const attrFields: Fields<Attribute.Details> = [
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
	];
	const attributes = mapTableInPage(info, rangeData, attrFields);
	for (let i = 0; i < attributes.length; i++) {
		attributes[i].index = i;
	}
	return attributes;
}

function filterAndMap<T>(attribute: Partial<Attribute.Details>, data: (T & HasAttribute)[]): T[] {
	return data.filter((x) => x.attribute === attribute.name).map((x) => ({ ...x, attribute: undefined }));
}

function getBoosts(info: SpreadsheetInfo) {
	const range = getEntireSheet(info, "Title Boosts");
	const boostFields: Fields<InternalBoost> = [
		{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
		{ key: "attribute", source: { type: "exact", name: "Attribute" }, parse: "string" },
		{ key: "boost", source: { type: "contains", contains: "Gain" }, parse: "number" },
		{ key: "title", source: { type: "exact", name: "Title" }, parse: "tiered_id" },
		{ key: "note", source: { type: "exact", name: "Note" }, parse: "rich" },
	];
	return mapTable(info, range, boostFields).filter(chapterFilter(info.chapterLimit, "chapter"));
}

function getGains(info: SpreadsheetInfo) {
	const range = getEntireSheet(info, "Stat Gains");
	const fields: Fields<InternalGain> = [
		{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
		{ key: "attribute", source: { type: "exact", name: "Attribute" }, parse: "string" },
		{ key: "gain", source: { type: "exact", name: "Gain" }, parse: "number" },
		{ key: "note", source: { type: "exact", name: "How / Why" }, parse: "rich" },
	];
	return mapTable(info, range, fields).filter(chapterFilter(info.chapterLimit, "chapter"));
}
