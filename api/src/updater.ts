import * as parsers from "./pages";
import { parseNumber } from "./pages/shared";

export function updateSpecificFiles(ss: Spreadsheet, pages: ApiPage[]) {
	const rrFolder = DriveApp.getFolderById(RR_FOLDER);
	const patreonFolder = DriveApp.getFolderById(PATREON_FOLDER);

	const tableRanges = getTableRanges(ss);
	const rrInfo = getSpreadsheetInfo(ss, tableRanges, false);
	const patreonInfo = getSpreadsheetInfo(ss, tableRanges, true);

	const errors = [];

	for (const page of pages) {
		try {
			console.log("Updating " + page);
			updatePageJson(rrFolder, rrInfo, page);
			updatePageJson(patreonFolder, patreonInfo, page);
		} catch (e) {
			errors.push(e);
			console.log("Failed to update " + page);
			console.error(e);
		}
	}
	// todo: write error logs to spreadsheet for better visibility
	if (errors.length > 0) throw errors;
}

function getSpreadsheetInfo(ss: Spreadsheet, ranges: RangeLookup, includePatreon: boolean): SpreadsheetInfo {
	const chapterLimit = includePatreon ? getPatreonChapter(ss) : getRoyalRoadChapter(ss);
	const attributes = parsers.getAttributes({
		ss,
		ranges,
		chapterLimit,
		includePatreon,
		attributeNames: [],
		attributes: [],
	});
	const attributeNames = attributes.map((x) => x.name);
	return { ss, chapterLimit, ranges, attributes, attributeNames, includePatreon };
}

function getPageParser(page: ApiPage): StandardParser<unknown> {
	switch (page) {
		case "achievements":
			return parsers.getAchievements;
		case "attributes":
			return (info) => info.attributes;
		case "body":
			return parsers.getBody;
		case "chapters":
			return parsers.getConfiguration;
		case "lore":
			return parsers.getLore;
		case "skills":
			return parsers.getSkills;
		case "statuses":
			return parsers.getOfficialStatuses;
		case "talents":
			return parsers.getTalents;
		case "titles":
			return parsers.getTitles;
		default:
			throw new Error("Unexpected page requested: " + page);
	}
}

function updatePageJson(folder: Folder, info: SpreadsheetInfo, page: ApiPage) {
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

/** Get latest chapter number released to the public */
function getRoyalRoadChapter(ss: Spreadsheet) {
	return parseNumber(ss.getRangeByName("RoyalRoadChapter")!.getValue());
}

/** Get latest chapter number released to patrons */
function getPatreonChapter(ss: Spreadsheet) {
	return parseNumber(ss.getRangeByName("PatreonChapter")!.getValue());
}
