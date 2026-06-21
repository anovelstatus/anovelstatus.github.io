import { chapterFilter, getEntireSheet, getRangeData, mapTableInPage } from "../parser";

export function getBody(info: SpreadsheetInfo): Body.Details {
	const range = getEntireSheet(info, "Body");
	const rangeData = getRangeData(range, true, false);

	return {
		mutations: getMutations(info, rangeData),
		races: getRaces(info, rangeData),
		bloodlines: getBloodlines(info, rangeData),
		tempering: getTempering(info, rangeData),
	};
}

function getMutations(info: SpreadsheetInfo, rangeData: RangeData) {
	const fields: Fields<Body.Modification> = [
		{ key: "name", source: { type: "exact", name: "Mutation" }, parse: "string" },
		{ key: "chapters", source: { type: "exact", name: "Chapters" }, parse: "split_number", limited: true },
		{ key: "tier", source: { type: "exact", name: "Rarity" }, parse: "string", optional: true },
		{ key: "type", source: { type: "exact", name: "Type" }, parse: "string" },
		{ key: "note", source: { type: "exact", name: "Description" }, parse: "string", optional: true },
		{ key: "source", source: { type: "exact", name: "Source" }, parse: "rich" },
	];
	return mapTableInPage(info, rangeData, fields).filter((x) => x.chapters.length > 0);
}

function getRaces(info: SpreadsheetInfo, rangeData: RangeData) {
	const fields: Fields<Race> = [
		{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
		{ key: "name", source: { type: "exact", name: "Race" }, parse: "string" },
		{ key: "tier", source: { type: "exact", name: "Tier" }, parse: "number" },
		{ key: "talents", source: { type: "exact", name: "Talents" }, parse: "split_tiered_id" },
		{ key: "freeSlots", source: { type: "exact", name: "Free Slots" }, parse: "number" },
		{ key: "note", source: { type: "exact", name: "Description" }, parse: "rich" },
	];
	return mapTableInPage(info, rangeData, fields).filter(chapterFilter(info.chapterLimit, "chapter"));
}

function getTempering(info: SpreadsheetInfo, rangeData: RangeData) {
	const stepFields: Fields<TemperingStep> = [
		{ key: "stage", source: { type: "exact", name: "Stage" }, parse: "string" },
		{ key: "category", source: { type: "exact", name: "Step" }, parse: "string" },
		{ key: "started", source: { type: "exact", name: "Started" }, parse: "number" },
		// If the step is completed in the future, treat it as not completed
		{ key: "completed", source: { type: "exact", name: "Finished" }, parse: "number", limited: true },
		{ key: "link", parse: "link", optional: true },
		{ key: "note", source: { type: "exact", name: "Update" }, parse: "rich" },
	];
	const steps = mapTableInPage(info, rangeData, stepFields).filter(chapterFilter(info.chapterLimit, "started"));

	const fields: Fields<TemperingStage> = [
		{ key: "name", source: { type: "exact", name: "Stage" }, parse: "string" },
		{ key: "tier", source: { type: "exact", name: "Quality" }, parse: "string" },
		{ key: "chapter", source: { type: "exact", name: "Revealed" }, parse: "number" },
		{ key: "expectedSteps", source: { type: "exact", name: "Steps" }, parse: "number" },
		{ key: "description", source: { type: "exact", name: "Description" }, parse: "rich" },
		// Must process after name
		{ key: "updates", parse: ({ rowSoFar }) => steps.filter((x) => x.stage === rowSoFar.name) },
	];
	return mapTableInPage(info, rangeData, fields).filter((x) => x.updates.length > 0);
}

function getBloodlines(info: SpreadsheetInfo, rangeData: RangeData) {
	const updateFields: Fields<BloodlineStatus> = [
		{ key: "name", source: { type: "exact", name: "Race" }, parse: "string" },
		{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: "number" },
		{ key: "purity", source: { type: "exact", name: "Purity" }, parse: "string_number" },
		{ key: "status", source: { type: "exact", name: "Status" }, parse: "string" },
		{ key: "note", source: { type: "exact", name: "Cause" }, parse: "rich" },
		{ key: "title", source: { type: "exact", name: "Title" }, parse: "tiered_id", optional: true },
	];
	const updates = mapTableInPage(info, rangeData, updateFields).filter(chapterFilter(info.chapterLimit, "chapter"));

	const bloodlineFields: Fields<Bloodline> = [
		{ key: "name", source: { type: "exact", name: "Bloodline" }, parse: "string" },
		{ key: "lore", source: { type: "exact", name: "Lore Key" }, parse: "string" },
		{ key: "quality", source: { type: "exact", name: "Quality" }, parse: "string" },
		// Must process after name
		{ key: "updates", parse: ({ rowSoFar }) => updates.filter((x) => x.name === rowSoFar.name) },
	];
	return mapTableInPage(info, rangeData, bloodlineFields).filter((x) => x.updates.length > 0);
}
