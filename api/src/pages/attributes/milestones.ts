import { parseDynamicTable } from "../shared";

export type InternalMilestone = Attribute.Milestone & { attribute: string };

export function getMilestones(info: SpreadsheetInfo) {
	const definition: Table<InternalMilestone> = {
		getRange: (info) => info.ss.getRange(info.ranges["Attribute Milestones"]),
		filter: (x) => !!x,
		fields: [
			{
				key: "attribute",
				source: { type: "column", name: "Attribute" },
				parse: { type: "string" },
			},
			{
				key: "milestone",
				source: { type: "column", name: "Milestone" },
				parse: { type: "number" },
			},
			{ key: "note", source: { type: "column", name: "Description" }, parse: { type: "rich" } },
		],
		extra: undefined,
	};
	return parseDynamicTable(info, definition);
}
