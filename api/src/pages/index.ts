import { getAchievements } from "./achievements";
import { getAttributes } from "./attributes/index";
import { getBody } from "./body/index";
import { getPatreonChapter, getRoyalRoadChapter, getConfiguration } from "./chapters";
import { getLore } from "./lore";
import { getTimelineShortcuts } from "./shortcuts";
import { getSkills } from "./skills/index";
import { getOfficialStatuses } from "./statuses";
import { getTalents } from "./talents";
import { getTitles } from "./titles";

export type SpreadsheetInfo = {
	chapterLimit: number;
	ranges: RangeLookup;
	attributeNames: string[];
	includePatreon: boolean;
};

export function getSpreadsheetInfo(spreadsheet: Spreadsheet, includePatreon: boolean): SpreadsheetInfo {
	const chapterLimit = includePatreon ? getPatreonChapter(spreadsheet) : getRoyalRoadChapter(spreadsheet);
	const ranges = getTableRanges(spreadsheet);
	const attributes = getAttributes(spreadsheet, ranges, [], chapterLimit);
	const attributeNames = attributes.map((x) => x.name);
	return { chapterLimit, ranges, attributeNames, includePatreon };
}

export function getPage(spreadsheet: Spreadsheet, info: SpreadsheetInfo, page: Page) {
	const { ranges, chapterLimit, attributeNames, includePatreon } = info;

	if (page === "chapters") return getConfiguration(includePatreon, spreadsheet, ranges, attributeNames, chapterLimit);

	const func = getPageParser(page);
	return func(spreadsheet, ranges, attributeNames, chapterLimit);
}

function getPageParser(page: Page): CacheableFunc<unknown> {
	switch (page) {
		case "achievements":
			return getAchievements;
		case "attributes":
			return getAttributes;
		case "body":
			return getBody;
		// "chapters" handled separately for now
		case "lore":
			return getLore;
		case "shortcuts":
			return getTimelineShortcuts;
		case "skills":
			return getSkills;
		case "statuses":
			return getOfficialStatuses;
		case "talents":
			return getTalents;
		case "titles":
			return getTitles;
		default:
			throw "Unexpected page requested: " + page;
	}
}

export function updatePageJson(
	ss: Spreadsheet,
	folder: GoogleAppsScript.Drive.Folder,
	info: SpreadsheetInfo,
	page: Page,
) {
	const fileName = page + ".json";
	const data = getPage(ss, info, page);
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
