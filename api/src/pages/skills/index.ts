import { getLevels, type InternalSkillGain } from "./levels";
import { parseId, setAttributeValues } from "../shared";

type Columns = Record<keyof Skill, number> & Record<string, number>;

export const getSkills: CacheableFunc<Skill[]> = (ss, ranges, attributeNames, chapterLimit) => {
	const skillLevels = getLevels(ss, ranges, chapterLimit);
	const skills = getList(ss, ranges, attributeNames);
	setGains(skills, skillLevels);
	return skills.filter((x) => x.gains.length > 0);
};

function setGains(skills: Skill[], skillLevels: InternalSkillGain[]) {
	for (const skill of skills) {
		const id = skill.name + " - " + skill.tier;
		skill.gains = skillLevels
			.filter((x) => x.id == id)
			.map((x) => ({
				note: x.note,
				chapter: x.chapter,
				count: x.count,
			}));
	}
}

function getList(ss: Spreadsheet, ranges: RangeLookup, attributeNames: string[]): Skill[] {
	const data = ss.getRange(ranges.Skills).getValues();
	const headers = mapColumns(data[0]!, attributeNames);

	return data
		.slice(1)
		.map((row) => mapRow(row, headers, attributeNames))
		.filter((x) => x.name);
}

function mapColumns(headerRow: string[], attributeNames: string[]): Columns {
	const headers: Partial<Columns> = {
		name: headerRow.indexOf("Name"),
		tier: headerRow.indexOf("Tier"),
		previous: headerRow.findIndex((x) => x.startsWith("Previous")),
		replaced: headerRow.findIndex((x) => x.includes("Replaced")),
	};
	for (const attribute of attributeNames) headers[attribute] = headerRow.indexOf(attribute);

	return headers as Columns;
}

function mapRow(row: SpreadsheetValue[], headers: Columns, attributeNames: string[]): Skill {
	const tier = row[headers["tier"]!] as string;

	const previous = row[headers["previous"]!] ? (row[headers["previous"]!] as string).split(", ") : [];

	const skill = {
		name: (row[headers["name"]!] as string).replace(" - " + tier, ""),
		tier: tier,
		previous: previous.map(parseId),
		replaced: row[headers["replaced"]!] as boolean,
		gains: [],
	} as unknown as Skill;
	setAttributeValues(skill, row, headers, attributeNames);
	return skill;
}
