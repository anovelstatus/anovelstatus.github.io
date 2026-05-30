import { parseDynamicTable } from "../shared";

export type InternalMilestone = Attribute.Milestone & { attribute: string };

export function getMilestones(info: SpreadsheetInfo) {
	const definition: Table<InternalMilestone> = {
		range: info.ss.getRange(info.ranges["Attribute Milestones"]),
		filter: (x) => !!x,
		fields: [
			{
				key: "attribute",
				source: { type: "exact", name: "Attribute" },
				parse: { type: "string" },
			},
			{
				key: "milestone",
				source: { type: "exact", name: "Milestone" },
				parse: { type: "number" },
			},
			{ key: "note", source: { type: "exact", name: "Description" }, parse: { type: "rich" } },
		],
		extra: undefined,
	};
	return parseDynamicTable(info, definition);
}
