import "./global.d.ts";
import "../../shared/types.d.ts";
import { getPage, getSpreadsheetInfo, updatePageJson } from "./pages/index.js";

/**
 * Randomly-generated string that users should paste into the website
 * in order to get not just public Royal Road info, but also the Patreon info.
 */
declare const PATREON_KEY: string;

declare const SS_LINK: string;

// ID of Google Drive folders where JSON files are stored
declare const RR_FOLDER: string;
declare const PATREON_FOLDER: string;

const ss = SpreadsheetApp.openByUrl(SS_LINK);

/* @ts-expect-error no-unused-local */
function doGet(e: GoogleAppsScript.Events.DoGet) {
	let content = "";
	console.log(e);
	try {
		const page = e.parameter["page"] as Page;
		const includePatreon = e.parameter["key"] === PATREON_KEY;
		const info = getSpreadsheetInfo(ss, includePatreon);
		const data = getPage(ss, info, page);
		content = JSON.stringify(data);
	} catch (err: Error | unknown) {
		console.log(err);
		if (err instanceof Error) content = err.message;
		else content = JSON.stringify(err);
	}
	return ContentService.createTextOutput(content);
}

/** Used for testing getting data from the spreadsheet */
/* @ts-expect-error no-unused-local */
function debug() {
	const page = "skills";
	const info = getSpreadsheetInfo(ss, true);
	const test = getPage(ss, info, page);
	console.log(test);
}

/** Used in trigger to update pre-generated responses */
/* @ts-expect-error no-unused-local */
function updateFiles() {
	const rrFolder = DriveApp.getFolderById(RR_FOLDER);
	const patreonFolder = DriveApp.getFolderById(PATREON_FOLDER);
	const allPages: Page[] = [
		"achievements",
		"attributes",
		"body",
		"chapters",
		"lore",
		"shortcuts",
		"skills",
		"statuses",
		"talents",
		"titles",
	];

	const rrInfo = getSpreadsheetInfo(ss, false);
	const patreonInfo = getSpreadsheetInfo(ss, true);

	for (const page of allPages) {
		updatePageJson(ss, rrFolder, rrInfo, page);
		updatePageJson(ss, patreonFolder, patreonInfo, page);
	}
}
