import * as parsers from "./pages";
import { parseNumber } from "./pages/shared";

export function updateSpecificFiles(ss: Spreadsheet, pages: ApiPage[]) {
	const rrFolder = DriveApp.getFolderById(RR_FOLDER);
	const patreonFolder = DriveApp.getFolderById(PATREON_FOLDER);

	const chapters = getChapters(ss);

	const rrInfo = getSpreadsheetInfo(ss, chapters.rr, false);
	const patreonInfo = getSpreadsheetInfo(ss, chapters.patreon, true);

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

function getSpreadsheetInfo(ss: Spreadsheet, chapterLimit: number, includePatreon: boolean): SpreadsheetInfo {
	const attributes = parsers.getAttributes({
		ss,
		chapterLimit,
		includePatreon,
		attributes: [],
	});
	return { ss, chapterLimit, attributes, includePatreon };
}

function getPageParser(page: ApiPage): (info: SpreadsheetInfo) => unknown {
	switch (page) {
		case "achievements":
			return parsers.getAchievements;
		// Don't re-fetch attributes, reuse them
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
		case "soul":
			return parsers.getSoul;
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

/** Get latest chapters released to public and patrons */
function getChapters(ss: Spreadsheet) {
	// on START HERE sheet, near the bottom
	const values = ss.getRangeByName("Chapters")!.getValues();
	const patreonValue = values[0][0];
	const rrValue = values[1][0];
	return { patreon: parseNumber(patreonValue), rr: parseNumber(rrValue) };
}
