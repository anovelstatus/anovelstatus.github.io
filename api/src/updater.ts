import * as parsers from "./pages";
import { parseNumber } from "./parser";

export function updateSpecificFiles(ss: Spreadsheet, pages: ApiPage[]) {
	const rrFolder = DriveApp.getFolderById(RR_FOLDER);
	const patreonFolder = DriveApp.getFolderById(PATREON_FOLDER);

	const rrFiles = getExistingFiles(rrFolder);
	const patreonFiles = getExistingFiles(patreonFolder);

	const chapters = getChapters(ss);
	const parserInfo = getParserInfo(ss);

	const errors = [];

	const rrInfo: LimiterInfo = { chapterLimit: chapters.rr, includePatreon: false };
	const patreonInfo: LimiterInfo = { chapterLimit: chapters.patreon, includePatreon: true };

	for (const page of pages) {
		try {
			console.log("Updating " + page);
			const parser = getParser(page);
			const limiter = getLimiter(page);

			const data = parser(parserInfo);

			// In case there's ever a bug where data is modified in place rather
			// than making a new object - do Patreon first since it deletes less.
			const patreonData = limiter(data, patreonInfo);
			updatePageJson(patreonFolder, patreonFiles[page], patreonData, page);

			const rrData = limiter(data, rrInfo);
			updatePageJson(rrFolder, rrFiles[page], rrData, page);
		} catch (e) {
			errors.push(e);
			console.log("Failed to update " + page);
			console.error(e);
		}
	}
	// todo: write error logs to spreadsheet for better visibility
	if (errors.length > 0) throw errors;
}

function getParserInfo(ss: Spreadsheet): SpreadsheetInfo {
	const attributes = parsers.getAttributes({ ss, attributes: [] });
	return { ss, attributes };
}

function getParser(page: ApiPage): (info: SpreadsheetInfo) => unknown {
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
function getLimiter(page: ApiPage): (data: any, info: LimiterInfo) => any {
	switch (page) {
		case "achievements":
			return parsers.limitAchievements;
		case "attributes":
			return parsers.limitAttributes;
		case "body":
			return parsers.limitBody;
		case "chapters":
			return parsers.limitConfiguration;
		case "lore":
			return parsers.limitLore;
		case "skills":
			return parsers.limitSkills;
		case "soul":
			return parsers.limitSoul;
		case "statuses":
			return parsers.limitStatuses;
		case "talents":
			return parsers.limitTalents;
		case "titles":
			return parsers.limitTitles;
		default:
			throw new Error("Unexpected page requested: " + page);
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
