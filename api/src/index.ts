import "./global.d.ts";
import "../../shared/types.d.ts";
import { getSpreadsheetInfo, updatePageJson } from "./pages/index.js";

/**
 * Randomly-generated string that users should paste into the website
 * in order to get not just public Royal Road info, but also the Patreon info.
 */
declare const PATREON_KEY: string;

declare const SS_LINK: string;

// ID of Google Drive folders where JSON files are stored
declare const RR_FOLDER: string;
declare const PATREON_FOLDER: string;

/* @ts-expect-error no-unused-local */
function doGet(e: GoogleAppsScript.Events.DoGet) {
	let content = "";
	console.log(e);
	try {
		const page = e.parameter["page"] as ApiPage;
		const includePatreon = e.parameter["key"] === PATREON_KEY;
		const file = getFile(includePatreon, page);
		content = file.getDataAsString();
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
	const test = getFile(true, "skills");
	console.log(test);
}

/** Used in trigger to update pre-generated responses */
/* @ts-expect-error no-unused-local */
function updateFiles() {
	console.log("Checking last modified dates");
	const tenMinutesAgo = new Date(new Date().valueOf() - 10 * 1_000 * 60);

	const ss = SpreadsheetApp.openByUrl(SS_LINK);
	const ssLastUpdated = DriveApp.getFileById(ss.getId()).getLastUpdated();
	console.log("Spreadsheet last modified at " + ssLastUpdated.toISOString());

	if (ssLastUpdated <= tenMinutesAgo) {
		console.log("Skipping update, since spreadsheet was modified before " + tenMinutesAgo.toISOString());
		return;
	}
	console.log("Updating...");
	updateAllFiles(ss);
}

/** Used to manually force a refresh. Useful if the response model changes, for example. */
function updateAllFiles(ss?: Spreadsheet) {
	ss = ss || SpreadsheetApp.openByUrl(SS_LINK);
	const rrFolder = DriveApp.getFolderById(RR_FOLDER);
	const patreonFolder = DriveApp.getFolderById(PATREON_FOLDER);
	const allPages: ApiPage[] = [
		"achievements",
		"attributes",
		"body",
		"chapters",
		"lore",
		"skills",
		"statuses",
		"talents",
		"titles",
	];

	const rrInfo = getSpreadsheetInfo(ss, false);
	const patreonInfo = getSpreadsheetInfo(ss, true);

	for (const page of allPages) {
		console.log("Updating " + page);
		updatePageJson(rrFolder, rrInfo, page);
		updatePageJson(patreonFolder, patreonInfo, page);
	}
}

/** Get contents of JSON file in folder */
function getFile(includePatreon: boolean, page: string): GoogleAppsScript.Base.Blob {
	const folder = DriveApp.getFolderById(includePatreon ? PATREON_FOLDER : RR_FOLDER);
	const fileResults = folder.getFilesByName(page + ".json");
	if (fileResults.hasNext()) return fileResults.next().getBlob();
	throw page + " not found";
}
