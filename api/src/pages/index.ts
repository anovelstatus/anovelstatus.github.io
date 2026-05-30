import { getAchievements } from "./achievements";
import { getAttributes } from "./attributes/index";
import { getBody } from "./body/index";
import { getConfiguration, getPatreonChapter, getRoyalRoadChapter } from "./chapters";
import { getLore } from "./lore";
import { getSkills } from "./skills/index";
import { getOfficialStatuses } from "./statuses";
import { getTalents } from "./talents";
import { getTitles } from "./titles";

export function getSpreadsheetInfo(ss: Spreadsheet, includePatreon: boolean): SpreadsheetInfo {
	const chapterLimit = includePatreon ? getPatreonChapter(ss) : getRoyalRoadChapter(ss);
	const ranges = getTableRanges(ss);
	const attributes = getAttributes({ ss, ranges, chapterLimit, includePatreon, attributeNames: [], attributes: [] });
	const attributeNames = attributes.map((x) => x.name);
	return { ss, chapterLimit, ranges, attributes, attributeNames, includePatreon };
}

function getPageParser(page: ApiPage): StandardParser<unknown> {
	switch (page) {
		case "achievements":
			return getAchievements;
		case "attributes":
			return (info) => info.attributes;
		case "body":
			return getBody;
		case "chapters":
			return getConfiguration;
		case "lore":
			return getLore;
		case "skills":
			return getSkills;
		case "statuses":
			return getOfficialStatuses;
		case "talents":
			return getTalents;
		case "titles":
			return getTitles;
		default:
			throw new Error("Unexpected page requested: " + page);
	}
}

export function updatePageJson(folder: Folder, info: SpreadsheetInfo, page: ApiPage) {
	const fileName = page + ".json";
	const parser = getPageParser(page);
	const data = parser(info);
	const json = JSON.stringify(data);

	const fileResults = folder.getFilesByName(fileName);
	if (fileResults.hasNext()) fileResults.next().setContent(json);
	else folder.createFile(fileName, json, MimeType.PLAIN_TEXT);
}

function getTableRanges(ss: Spreadsheet): RangeLookup {
	const values = ss.getSheetByName("Tables")!.getDataRange().getValues();

	return values.slice(2).reduce((ranges, row) => {
		ranges[row[0] as RangeKey] = row[2];
		return ranges;
	}, {} as Partial<RangeLookup>) as RangeLookup;
}
