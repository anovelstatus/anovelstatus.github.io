import { getLevels, type InternalSkillGain } from "./levels";
import { parseFormattedTable, parseId, parseRichText, setAttributeValues } from "../shared";

type Columns = Record<keyof (Skill & SkillDetails & TieredId), number>;
type Extra = { attributeNames: string[]; skillLevels: InternalSkillGain[] };

export const getSkills: StandardParser<Skill[]> = (info) => {
	const skillLevels = getLevels(info);
	const range = info.ss.getSheetByName("Skill List")!.getDataRange();
	const extra = { attributeNames: info.attributeNames, skillLevels };
	return parseFormattedTable(range, mapColumns, mapRow, (x) => !!x.name && x.gains.length > 0, extra);
};

function mapColumns(headerRow: SpreadsheetValue[], extra: Extra): Columns {
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
	for (const attribute of extra.attributeNames) headers[attribute] = headerRow.indexOf(attribute);

	return headers as Columns;
}

function mapRow(row: SpreadsheetValue[], richRow: RichValue[], headers: Columns, extra: Extra): Skill {
	const tier = row[headers["tier"]!] as string;
	const name = (row[headers["name"]!] as string).replace(" - " + tier, "");
	const id = name + " - " + tier;

	const previous = row[headers["previous"]!] ? (row[headers["previous"]!] as string).split(", ") : [];
	const gains = extra.skillLevels
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
	setAttributeValues(skill, row, headers, extra.attributeNames);
	return skill;
}
