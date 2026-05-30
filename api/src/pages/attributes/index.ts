import { parseDynamicTable } from "../shared";
import { getBoosts } from "./boosts";
import { getEvolutions } from "./evolutions";
import { getGains } from "./gains";
import { getMilestones } from "./milestones";

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
			{
				key: "milestones",
				parse: {
					type: "custom",
					parse: ({ rowSoFar }) => reduceAttributeData<Attribute.Milestone>(rowSoFar.name!, milestones),
				},
			},
			{
				key: "evolutions",
				parse: {
					type: "custom",
					parse: ({ rowSoFar }) => reduceAttributeData<Attribute.Evolution>(rowSoFar.name!, evolutions),
				},
			},
			{
				key: "gains",
				parse: {
					type: "custom",
					parse: ({ rowSoFar }) => reduceAttributeData<Attribute.Gain>(rowSoFar.name!, gains),
				},
			},
			{
				key: "boosts",
				parse: {
					type: "custom",
					parse: ({ rowSoFar }) => reduceAttributeData<Attribute.Boost>(rowSoFar.name!, boosts),
				},
			},
		],
	};
	return parseDynamicTable(info, definition);
}

function reduceAttributeData<T>(attribute: string, data: (T & { attribute: string })[]): T[] {
	return data.filter((x) => x.attribute === attribute).map((x) => ({ ...x, attribute: undefined }));
}
