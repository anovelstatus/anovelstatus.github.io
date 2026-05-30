import { parseFormattedTable, parseRichText, parseString } from "../shared";
import { getBoosts, type InternalBoost } from "./boosts";
import { getEvolutions, type InternalEvolution } from "./evolutions";
import { getGains, type InternalGain } from "./gains";
import { getMilestones, type InternalMilestone } from "./milestones";

type Columns = Omit<Record<keyof Attribute.Details, number>, "milestones" | "evolutions" | "boosts" | "gains">;
type Extra = {
	milestones: InternalMilestone[];
	evolutions: InternalEvolution[];
	gains: InternalGain[];
	boosts: InternalBoost[];
};

export const getAttributes: StandardParser<Attribute.Details[]> = (info) => {
	const milestones = getMilestones(info);
	const evolutions = getEvolutions(info);
	const boosts = getBoosts(info);
	const gains = getGains(info);

	const extra = { milestones, evolutions, gains, boosts };

	const range = info.ss.getRange(info.ranges.Attributes);
	return parseFormattedTable(range, mapColumns, mapRow, (_) => true, extra);
};

function mapColumns(headerRow: SpreadsheetValue[]): Columns {
	return {
		name: headerRow.indexOf("Name"),
		abbreviation: headerRow.indexOf("Short"),
		category: headerRow.indexOf("Category"),
		categoryAbbreviation: headerRow.indexOf("CategoryShort"),
		note: headerRow.indexOf("Description"),
		color: headerRow.indexOf("Color"),
	};
}

function mapRow(row: SpreadsheetValue[], richRow: RichValue[], headers: Columns, extra: Extra): Attribute.Details {
	const attribute = parseString(row[headers.name]);
	const attributeFilter = getAttributeFilter(attribute);
	return {
		name: attribute,
		abbreviation: parseString(row[headers.abbreviation]),
		category: parseString(row[headers.category]),
		categoryAbbreviation: parseString(row[headers.categoryAbbreviation]),
		note: parseRichText(richRow[headers.note]!),
		color: parseString(row[headers.color]),
		milestones: extra.milestones.filter(attributeFilter).map(removeAttribute),
		evolutions: extra.evolutions.filter(attributeFilter).map(removeAttribute),
		gains: extra.gains.filter(attributeFilter).map(removeAttribute),
		boosts: extra.boosts.filter(attributeFilter).map(removeAttribute),
	};
}

function getAttributeFilter(attribute: string): (x: { attribute: string }) => boolean {
	return (x) => x.attribute === attribute;
}

function removeAttribute<T>(x: T & { attribute: string }): T {
	return { ...x, attribute: undefined };
}
