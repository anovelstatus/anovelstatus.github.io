import { chapterFilter, hasEntriesFilter, parseDynamicTable } from "../shared";

export function getTempering(info: SpreadsheetInfo) {
	const updates = getSteps(info);

	const definition: Table<TemperingStage, TemperingStep[]> = {
		range: info.ss.getRange(info.ranges["Body Tempering Stages"]),
		filter: hasEntriesFilter("updates"),
		fields: [
			{ key: "name", source: { type: "exact", name: "Stage" }, parse: { type: "string" } },
			{ key: "tier", source: { type: "exact", name: "Quality" }, parse: { type: "string" } },
			{ key: "chapter", source: { type: "exact", name: "Revealed" }, parse: { type: "number" } },
			{ key: "expectedSteps", source: { type: "exact", name: "Steps" }, parse: { type: "number" } },
			{ key: "description", source: { type: "exact", name: "Description" }, parse: { type: "rich" } },
			{
				key: "updates",
				parse: {
					type: "custom",
					parse({ rowSoFar, extra }) {
						return extra.filter((x) => x.stage === rowSoFar.name);
					},
				},
			},
		],
		extra: updates,
	};
	return parseDynamicTable(info, definition);
}

export function getSteps(info: SpreadsheetInfo) {
	const definition: Table<TemperingStep> = {
		range: info.ss.getRange(info.ranges["Body Tempering Progress"]),
		filter: chapterFilter(info.chapterLimit, "started"),
		fields: [
			{ key: "stage", source: { type: "exact", name: "Stage" }, parse: { type: "string" } },
			{ key: "category", source: { type: "exact", name: "Step" }, parse: { type: "string" } },
			{ key: "started", source: { type: "exact", name: "Started" }, parse: { type: "number" } },
			{ key: "completed", source: { type: "exact", name: "Finished" }, parse: { type: "number", limited: true } },
			{ key: "linkType", source: { type: "exact", name: "Link Type" }, parse: { type: "string" } },
			{ key: "link", source: { type: "exact", name: "Link" }, parse: { type: "tiered_id", optional: true } },
			{ key: "note", source: { type: "exact", name: "Update" }, parse: { type: "rich" } },
		],
		extra: undefined,
	};
	return parseDynamicTable(info, definition);
}
