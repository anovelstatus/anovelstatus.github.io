import { chapterFilter, hasEntriesFilter, parseDynamicTable } from "./shared";

export const getBody: StandardParser<Body.Details> = (info) => {
	return {
		mutations: getMutations(info),
		races: getRaces(info),
		bloodlines: getBloodlines(info),
		tempering: getTempering(info),
	};
};

function getMutations(info: SpreadsheetInfo) {
	const definition: Table<Body.Modification> = {
		range: info.ss.getRange(info.ranges.Mutations),
		filter: hasEntriesFilter("chapters"),
		fields: [
			{ key: "name", source: { type: "exact", name: "Mutation" }, parse: { type: "string" } },
			{ key: "chapters", source: { type: "exact", name: "Chapters" }, parse: { type: "split_number", limited: true } },
			{ key: "tier", source: { type: "exact", name: "Rarity" }, parse: { type: "string", optional: true } },
			{ key: "type", source: { type: "exact", name: "Type" }, parse: { type: "string" } },
			{ key: "note", source: { type: "exact", name: "Description" }, parse: { type: "string", optional: true } },
			{ key: "source", source: { type: "exact", name: "Source" }, parse: { type: "rich" } },
		],
	};
	return parseDynamicTable(info, definition);
}

function getRaces(info: SpreadsheetInfo) {
	const definition: Table<Race> = {
		range: info.ss.getRange(info.ranges.Races),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: { type: "number" } },
			{ key: "name", source: { type: "exact", name: "Race" }, parse: { type: "string" } },
			{ key: "tier", source: { type: "exact", name: "Tier" }, parse: { type: "number" } },
			{ key: "talents", source: { type: "exact", name: "Talents" }, parse: { type: "split_tiered_id" } },
			{ key: "freeSlots", source: { type: "exact", name: "Free Slots" }, parse: { type: "number" } },
			{ key: "note", source: { type: "exact", name: "Description" }, parse: { type: "rich" } },
		],
	};
	return parseDynamicTable(info, definition);
}

export function getTempering(info: SpreadsheetInfo) {
	const updates = getTemperingSteps(info);

	const definition: Table<TemperingStage> = {
		range: info.ss.getRange(info.ranges["Body Tempering Stages"]),
		filter: hasEntriesFilter("updates"),
		fields: [
			{ key: "name", source: { type: "exact", name: "Stage" }, parse: { type: "string" } },
			{ key: "tier", source: { type: "exact", name: "Quality" }, parse: { type: "string" } },
			{ key: "chapter", source: { type: "exact", name: "Revealed" }, parse: { type: "number" } },
			{ key: "expectedSteps", source: { type: "exact", name: "Steps" }, parse: { type: "number" } },
			{ key: "description", source: { type: "exact", name: "Description" }, parse: { type: "rich" } },
			// Must process after name
			{
				key: "updates",
				parse: { type: "custom", parse: ({ rowSoFar }) => updates.filter((x) => x.stage === rowSoFar.name) },
			},
		],
	};
	return parseDynamicTable(info, definition);
}

function getTemperingSteps(info: SpreadsheetInfo) {
	const definition: Table<TemperingStep> = {
		range: info.ss.getRange(info.ranges["Body Tempering Progress"]),
		filter: chapterFilter(info.chapterLimit, "started"),
		fields: [
			{ key: "stage", source: { type: "exact", name: "Stage" }, parse: { type: "string" } },
			{ key: "category", source: { type: "exact", name: "Step" }, parse: { type: "string" } },
			{ key: "started", source: { type: "exact", name: "Started" }, parse: { type: "number" } },
			// If the step is completed in the future, treat it as not completed
			{ key: "completed", source: { type: "exact", name: "Finished" }, parse: { type: "number", limited: true } },
			{ key: "linkType", source: { type: "exact", name: "Link Type" }, parse: { type: "string" } },
			{ key: "link", source: { type: "exact", name: "Link" }, parse: { type: "tiered_id", optional: true } },
			{ key: "note", source: { type: "exact", name: "Update" }, parse: { type: "rich" } },
		],
	};
	return parseDynamicTable(info, definition);
}

export function getBloodlines(info: SpreadsheetInfo) {
	const updates = getBloodlineUpdates(info);

	const definition: Table<Bloodline> = {
		range: info.ss.getRange(info.ranges.Bloodlines),
		filter: hasEntriesFilter("updates"),
		fields: [
			{ key: "name", source: { type: "exact", name: "Bloodline" }, parse: { type: "string" } },
			{ key: "lore", source: { type: "exact", name: "Lore Key" }, parse: { type: "string" } },
			{ key: "quality", source: { type: "exact", name: "Quality" }, parse: { type: "string" } },
			// Must process after name
			{
				key: "updates",
				parse: { type: "custom", parse: ({ rowSoFar }) => updates.filter((x) => x.name === rowSoFar.name) },
			},
		],
	};
	return parseDynamicTable(info, definition);
}

function getBloodlineUpdates(info: SpreadsheetInfo) {
	const definition: Table<BloodlineStatus> = {
		range: info.ss.getRange(info.ranges["Bloodline Updates"]),
		filter: chapterFilter(info.chapterLimit, "chapter"),
		fields: [
			{ key: "name", source: { type: "exact", name: "Race" }, parse: { type: "string" } },
			{ key: "chapter", source: { type: "exact", name: "Chapter" }, parse: { type: "number" } },
			{ key: "purity", source: { type: "exact", name: "Purity" }, parse: { type: "string_number" } },
			{ key: "status", source: { type: "exact", name: "Status" }, parse: { type: "string" } },
			{ key: "note", source: { type: "exact", name: "Cause" }, parse: { type: "rich" } },
			{ key: "title", source: { type: "exact", name: "Title" }, parse: { type: "tiered_id", optional: true } },
		],
	};
	return parseDynamicTable(info, definition);
}
