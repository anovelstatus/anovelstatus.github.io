import { parseFormattedTable, parseRichText } from "../shared";
import { getBoosts, type InternalBoost } from "./boosts";
import { getEvolutions, type InternalEvolution } from "./evolutions";
import { getGains, type InternalGain } from "./gains";
import { getMilestones, type InternalMilestone } from "./milestones";

type Columns = Omit<Record<keyof Attribute.Details, number>, "milestones" | "evolutions" | "boosts" | "gains">;

export const getAttributes: CacheableFunc<Attribute.Details[]> = (ss, ranges, attributes, chapterLimit) => {
	const milestones = getMilestones(ss, ranges, attributes, chapterLimit);
	const evolutions = getEvolutions(ss, ranges, attributes, chapterLimit);
	const boosts = getBoosts(ss, ranges, attributes, chapterLimit);
	const gains = getGains(ss, ranges, attributes, chapterLimit);

	const range = ss.getRange(ranges.Attributes);
	return parseFormattedTable(
		range,
		mapColumns,
		(row, richRow, headers) => mapRow(row, richRow, headers, milestones, evolutions, gains, boosts),
		(_) => true,
	);
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

function getAttributeFilter(attribute: string): (x: { attribute: string }) => boolean {
	return (x) => x.attribute === attribute;
}

function mapRow(
	row: SpreadsheetValue[],
	richRow: RichValue[],
	headers: Columns,
	milestones: InternalMilestone[],
	evolutions: InternalEvolution[],
	gains: InternalGain[],
	boosts: InternalBoost[],
): Attribute.Details {
	const attributeFilter = getAttributeFilter(row[headers.name] as string);
	return {
		name: row[headers.name] as string,
		abbreviation: row[headers.abbreviation] as string,
		category: row[headers.category] as string,
		categoryAbbreviation: row[headers.categoryAbbreviation] as string,
		note: parseRichText(richRow[headers.note]!),
		color: row[headers.color] as string,
		milestones: milestones.filter(attributeFilter).map((x) => ({ milestone: x.milestone, note: x.note })),
		evolutions: evolutions.filter(attributeFilter).map((x) => ({ note: x.note, chapter: x.chapter, name: x.name })),
		gains: gains.filter(attributeFilter),
		boosts: boosts.filter(attributeFilter).map((x) => ({
			note: x.note,
			chapter: x.chapter,
			title: x.title,
			titleId: x.titleId,
			boost: x.boost,
		})),
	};
}
