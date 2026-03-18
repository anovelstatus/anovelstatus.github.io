import { getLevels, type InternalSkillGain } from "./levels";
import { parseFormattedTable, parseId, parseRichText, setAttributeValues } from "../shared";

type Columns = Record<keyof (Skill & SkillDetails & TieredId), number>;

export const getSkills: CacheableFunc<Skill[]> = (ss, ranges, attributeNames, chapterLimit) => {
	const skillLevels = getLevels(ss, ranges, chapterLimit);
	return getList(ss, ranges, attributeNames, skillLevels);
};

function getList(
	ss: Spreadsheet,
	_ranges: RangeLookup,
	attributeNames: string[],
	skillLevels: InternalSkillGain[],
): Skill[] {
	const range = ss.getSheetByName("Skill List")!.getDataRange();
	return parseFormattedTable(
		range,
		(headerRow) => mapColumns(headerRow, attributeNames),
		(row, richRow, headers) => mapRow(row, richRow, headers, attributeNames, skillLevels),
		(x) => !!x.name && x.gains.length > 0,
	);
}

function mapColumns(headerRow: SpreadsheetValue[], attributeNames: string[]): Columns {
	const headers: Partial<Columns> = {
		name: headerRow.indexOf("Name"),
		tier: headerRow.indexOf("Tier"),
		previous: headerRow.findIndex((x) => typeof x === "string" && x.startsWith("Previous")),
		replaced: headerRow.findIndex((x) => typeof x === "string" && x.includes("Replaced")),
		description: headerRow.indexOf("Description"),
		prerequisites: headerRow.indexOf("Prerequisites"),
		quality: headerRow.indexOf("Quality"),
		bonuses: headerRow.indexOf("Bonus"),
		notes: headerRow.indexOf("Note"),
		tags: headerRow.indexOf("Tags"),
	};
	for (const attribute of attributeNames) headers[attribute] = headerRow.indexOf(attribute);

	return headers as Columns;
}

function mapRow(
	row: SpreadsheetValue[],
	richRow: RichValue[],
	headers: Columns,
	attributeNames: string[],
	skillLevels: InternalSkillGain[],
): Skill {
	const tier = row[headers["tier"]!] as string;
	const name = (row[headers["name"]!] as string).replace(" - " + tier, "");
	const id = name + " - " + tier;

	const previous = row[headers["previous"]!] ? (row[headers["previous"]!] as string).split(", ") : [];
	const gains = skillLevels
		.filter((x) => x.id == id)
		.map((x) => ({
			note: x.note,
			chapter: x.chapter,
			count: x.count,
		}));

	const skill = {
		name: name,
		tier: tier,
		previous: previous.map(parseId),
		replaced: row[headers["replaced"]!] as boolean,
		gains: gains,
		description: parseRichText(richRow[headers["description"]!]),
		prerequisites: row[headers["prerequisites"]!] as string,
		quality: row[headers["quality"]!] as string,
		bonuses: parseRichText(richRow[headers["bonuses"]!]),
		notes: parseRichText(richRow[headers["notes"]!]),
		tags: row[headers["tags"]!] as string,
		// casting as unknown because the Record<string, number> for attribute gains messes with the type inference
	} as unknown as Skill;
	setAttributeValues(skill, row, headers, attributeNames);
	return skill;
}
