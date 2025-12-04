import { getBoosts } from "./boosts";
import { getEvolutions } from "./evolutions";
import { getGains } from "./gains";
import { getMilestones } from "./milestones";

type InternalAttribute = Omit<Attribute.Details, "milestones" | "evolutions" | "boosts" | "gains">;
type Columns = Record<keyof InternalAttribute, number>;

export const getAttributes: CacheableFunc<Attribute.Details[]> = (ss, ranges, attributes, chapterLimit) => {
	const milestones = getMilestones(ss, ranges, attributes, chapterLimit);
	const evolutions = getEvolutions(ss, ranges, attributes, chapterLimit);
	const boosts = getBoosts(ss, ranges, attributes, chapterLimit);
	const gains = getGains(ss, ranges, attributes, chapterLimit);

	const data = ss.getRange(ranges.Attributes).getValues();
	const headers = mapColumns(data[0]!);

	return data.slice(1).map((row) => {
		const name = row[headers.name] as string;
		const attributeFilter = getAttributeFilter(name);
		return {
			...mapRow(row, headers),
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
	});
};

function mapColumns(headerRow: string[]): Columns {
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

function mapRow(row: SpreadsheetValue[], headers: Columns): InternalAttribute {
	return {
		name: row[headers.name] as string,
		abbreviation: row[headers.abbreviation] as string,
		category: row[headers.category] as string,
		categoryAbbreviation: row[headers.categoryAbbreviation] as string,
		note: row[headers.note] as string,
		color: row[headers.color] as string,
	};
}
