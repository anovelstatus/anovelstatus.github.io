import * as parsers from "./pages";
import { parseNumber } from "./parser";

export function updateSpecificFiles(ss: Spreadsheet, pages: ApiPage[]) {
	const rrFolder = DriveApp.getFolderById(RR_FOLDER);
	const patreonFolder = DriveApp.getFolderById(PATREON_FOLDER);

	const rrFiles = getExistingFiles(rrFolder);
	const patreonFiles = getExistingFiles(patreonFolder);

	const chapters = getChapters(ss);

	const rrInfo = getSpreadsheetInfo(ss, chapters.rr, false);
	const patreonInfo = getSpreadsheetInfo(ss, chapters.patreon, true);

	const errors = [];

	const rrLimiter: LimiterInfo = { chapterLimit: chapters.rr, includePatreon: false };
	const patreonLimiter: LimiterInfo = { chapterLimit: chapters.patreon, includePatreon: true };

	for (const page of pages) {
		try {
			console.log("Updating " + page);
			const parser = getPageParser(page);
			const limiter = getChapterLimiter(page);
			let rrData, patreonData;
			if (limiter) {
				const data = parser(patreonInfo);
				rrData = limiter(data, rrLimiter);
				patreonData = limiter(data, patreonLimiter);
			} else {
				rrData = parser(rrInfo);
				patreonData = parser(patreonInfo);
			}
			updatePageJson(rrFolder, rrFiles[page], rrData, page);
			updatePageJson(patreonFolder, patreonFiles[page], patreonData, page);
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

// todo: figure out generic type here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getChapterLimiter(page: ApiPage): undefined | ((data: any, info: LimiterInfo) => any) {
	switch (page) {
		case "achievements":
			return parsers.limitAchievements;
		case "chapters":
			return parsers.limitConfiguration;
		default:
			return;
	}
}

function updatePageJson(
	folder: Folder,
	existingFile: GoogleAppsScript.Drive.File | undefined,
	data: unknown,
	page: ApiPage,
) {
	const json = JSON.stringify(data);
	if (existingFile) existingFile.setContent(json);
	else folder.createFile(page + ".json", json, MimeType.PLAIN_TEXT);
}

/** Get latest chapters released to public and patrons */
function getChapters(ss: Spreadsheet) {
	// on START HERE sheet, near the bottom
	const values = ss.getRangeByName("Chapters")!.getValues();
	const patreonValue = values[0][0];
	const rrValue = values[1][0];
	return { patreon: parseNumber(patreonValue), rr: parseNumber(rrValue) };
}

function getExistingFiles(folder: GoogleAppsScript.Drive.Folder) {
	const files: Record<string, GoogleAppsScript.Drive.File> = {};
	const fileIterator = folder.getFiles();
	while (fileIterator.hasNext()) {
		const file = fileIterator.next();
		const name = file.getName().replace(".json", "");
		files[name] = file;
	}
	return files;
}
