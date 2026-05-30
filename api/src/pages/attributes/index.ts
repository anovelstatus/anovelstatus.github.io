import { parseDynamicTable } from "../shared";
import { getBoosts, type InternalBoost } from "./boosts";
import { getEvolutions, type InternalEvolution } from "./evolutions";
import { getGains, type InternalGain } from "./gains";
import { getMilestones, type InternalMilestone } from "./milestones";

type Extra = {
	milestones: InternalMilestone[];
	evolutions: InternalEvolution[];
	gains: InternalGain[];
	boosts: InternalBoost[];
};

export function getAttributes(info: SpreadsheetInfo) {
	const milestones = getMilestones(info);
	const evolutions = getEvolutions(info);
	const boosts = getBoosts(info);
	const gains = getGains(info);

	const definition: Table<Attribute.Details, Extra> = {
		getRange: (info) => info.ss.getRange(info.ranges.Attributes),
		fields: [
			{
				key: "name",
				source: { type: "column", name: "Name" },
				parse: { type: "string" },
			},
			{
				key: "abbreviation",
				source: { type: "column", name: "Short" },
				parse: { type: "string" },
			},
			{
				key: "category",
				source: { type: "column", name: "Category" },
				parse: { type: "string" },
			},
			{
				key: "categoryAbbreviation",
				source: { type: "column", name: "CategoryShort" },
				parse: { type: "string" },
			},
			{
				key: "color",
				source: { type: "column", name: "Color" },
				parse: { type: "string" },
			},
			{ key: "note", source: { type: "column", name: "Description" }, parse: { type: "rich" } },
			{
				key: "milestones",
				parse: {
					type: "custom",
					parse: (rowSoFar, extra) => reduceAttributeData<Attribute.Milestone>(rowSoFar.name!, extra.milestones),
				},
			},
			{
				key: "evolutions",
				parse: {
					type: "custom",
					parse: (rowSoFar, extra) => reduceAttributeData<Attribute.Evolution>(rowSoFar.name!, extra.evolutions),
				},
			},
			{
				key: "gains",
				parse: {
					type: "custom",
					parse: (rowSoFar, extra) => reduceAttributeData<Attribute.Gain>(rowSoFar.name!, extra.gains),
				},
			},
			{
				key: "boosts",
				parse: {
					type: "custom",
					parse: (rowSoFar, extra) => reduceAttributeData<Attribute.Boost>(rowSoFar.name!, extra.boosts),
				},
			},
		],
		extra: { milestones, evolutions, gains, boosts },
	};
	return parseDynamicTable(info, definition);
}

function reduceAttributeData<T>(attribute: string, data: (T & { attribute: string })[]): T[] {
	return data.filter((x) => x.attribute === attribute).map((x) => ({ ...x, attribute: undefined }));
}
